import time
from collections import defaultdict

from core.auth import verify_token
from core.logging import setup_logging
from fastapi import APIRouter, Depends, HTTPException, Request, status
from models.contact import ContactSubmission, ContactSubmissionOut
from pydantic import BaseModel, EmailStr
from services.email import send_contact_acknowledgement, send_contact_email

router = APIRouter()
logger = setup_logging(name="contact-form")

# In-memory sliding-window rate limit. Single uvicorn process (no --workers),
# so a module-level dict is sufficient -- no shared store needed.
RATE_LIMIT_MAX_REQUESTS = 3
RATE_LIMIT_WINDOW_SECONDS = 600  # 10 minutes
_submission_log: dict[str, list[float]] = defaultdict(list)

# Set from main.py's startup event, matching the convention in blog.py.
submissions_collection = None


def set_submissions_collection(collection):
    global submissions_collection
    submissions_collection = collection


def _is_rate_limited(client_ip: str) -> bool:
    now = time.monotonic()
    timestamps = _submission_log[client_ip]
    timestamps[:] = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
        return True
    timestamps.append(now)
    return False


class ContactSubmissionIn(BaseModel):
    name: str
    email: EmailStr
    message: str
    website: str = ""  # honeypot -- real users never see/fill this field


async def _persist(submission: ContactSubmission) -> str | None:
    """
    Store the submission before any email is attempted (#122).

    Order matters: persisting first means a Resend outage costs a notification,
    not the message itself. A storage failure is logged and swallowed -- losing
    the record is bad, but refusing a submission that we could still email
    would be worse.
    """
    if submissions_collection is None:
        logger.error("❌ Submissions collection is not configured — storing nothing")
        return None
    try:
        result = await submissions_collection.insert_one(submission.model_dump())
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"❌ Failed to persist contact submission: {e}")
        return None


async def _record_delivery(submission_id: str | None, fields: dict) -> None:
    if submission_id is None or submissions_collection is None:
        return
    try:
        from bson import ObjectId

        await submissions_collection.update_one(
            {"_id": ObjectId(submission_id)}, {"$set": fields}
        )
    except Exception as e:
        logger.error(f"❌ Failed to record delivery status: {e}")


@router.post("/api/contact")
async def submit_contact(data: ContactSubmissionIn, request: Request):
    """
    Handle a contact form submission: persist it, notify the owner, acknowledge
    to the sender.
    """
    client_ip = request.client.host

    if data.website:
        # Honeypot filled -- almost certainly a bot. Fake success so it doesn't
        # learn to avoid the field. Nothing is stored and nothing is sent:
        # an acknowledgement here would confirm the address to a spammer.
        logger.warning(f"🕸️ Honeypot triggered on contact form from {client_ip}")
        return {"message": "✅ Message received and email sent. Thank you!"}

    if _is_rate_limited(client_ip):
        logger.warning(f"🚫 Rate limit exceeded on contact form from {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many submissions. Please try again later."
        )

    logger.info(f"📨 Contact form submission received from {client_ip}")
    # Submitter address stays at DEBUG only. The lines below run at INFO, land
    # in a file, and that file was tracked in git for over a year before anyone
    # noticed (#120). Keep personal data out of the default log level.
    logger.debug(f"Contact form data: Name={data.name}, Email={data.email}")

    submission = ContactSubmission(
        name=data.name, email=data.email, message=data.message, client_ip=client_ip
    )
    submission_id = await _persist(submission)

    try:
        sent, message_id = send_contact_email(data.name, data.email, data.message)
    except Exception as e:
        logger.error(f"An unexpected error occurred sending the notification: {e!s}")
        await _record_delivery(submission_id, {"notification_status": "failed"})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        ) from e

    await _record_delivery(
        submission_id,
        {
            "notification_status": "sent" if sent else "failed",
            "notification_message_id": message_id,
        },
    )

    if not sent:
        logger.error("❌ Failed to send contact notification — see the service log for detail")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email"
        )

    # The acknowledgement is a courtesy (#121). Its failure must never fail the
    # request: the owner already has the message, which is what the submitter
    # actually cares about.
    try:
        acked, ack_id = send_contact_acknowledgement(data.name, data.email, data.message)
    except Exception as e:
        logger.error(f"❌ Acknowledgement raised, continuing anyway: {e}")
        acked, ack_id = False, None

    await _record_delivery(
        submission_id,
        {
            "acknowledgement_status": "sent" if acked else "failed",
            "acknowledgement_message_id": ack_id,
        },
    )

    return {"message": "✅ Message received and email sent. Thank you!"}


@router.get(
    "/api/admin/contact-submissions",
    response_model=list[ContactSubmissionOut],
    dependencies=[Depends(verify_token)],
)
async def list_contact_submissions(limit: int = 100):
    """Newest first. Admin only."""
    if submissions_collection is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Submissions storage is unavailable"
        )
    cursor = submissions_collection.find().sort("submitted_at", -1).limit(limit)
    return [
        ContactSubmissionOut(
            id=str(doc["_id"]),
            name=doc.get("name", ""),
            email=doc.get("email", ""),
            message=doc.get("message", ""),
            submitted_at=doc["submitted_at"],
            notification_status=doc.get("notification_status", "pending"),
            acknowledgement_status=doc.get("acknowledgement_status", "pending"),
        )
        async for doc in cursor
    ]
