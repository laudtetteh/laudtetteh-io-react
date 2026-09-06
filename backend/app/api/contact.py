import time
from collections import defaultdict

from core.logging import setup_logging
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from services.email import send_contact_email

router = APIRouter()
logger = setup_logging(name="contact-form")

# In-memory sliding-window rate limit. Single uvicorn process (no --workers),
# so a module-level dict is sufficient -- no shared store needed.
RATE_LIMIT_MAX_REQUESTS = 3
RATE_LIMIT_WINDOW_SECONDS = 600  # 10 minutes
_submission_log: dict[str, list[float]] = defaultdict(list)

def _is_rate_limited(client_ip: str) -> bool:
    now = time.monotonic()
    timestamps = _submission_log[client_ip]
    timestamps[:] = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
        return True
    timestamps.append(now)
    return False

class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    message: str
    website: str = ""  # honeypot -- real users never see/fill this field

@router.post("/api/contact")
async def submit_contact(data: ContactSubmission, request: Request):
    """
    Handle contact form submission and send email notification.
    """
    client_ip = request.client.host

    if data.website:
        # Honeypot filled -- almost certainly a bot. Fake success so it
        # doesn't learn to avoid the field, but never actually send the email.
        logger.warning(f"🕸️ Honeypot triggered on contact form from {client_ip}")
        return {"message": "✅ Message received and email sent. Thank you!"}

    if _is_rate_limited(client_ip):
        logger.warning(f"🚫 Rate limit exceeded on contact form from {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many submissions. Please try again later."
        )

    logger.info(f"📨 Contact form submission received from {client_ip}")
    # Submitter address stays at DEBUG only. The success and failure lines below
    # deliberately omit it: those run at INFO, land in a file, and that file was
    # tracked in git for over a year before anyone noticed (#120). Keep personal
    # data out of the log level that is on by default.
    logger.debug(f"Contact form data: Name={data.name}, Email={data.email}")

    try:
        success = send_contact_email(data.name, data.email, data.message)
        if success:
            logger.info("✅ Contact email sent successfully")
            return {"message": "✅ Message received and email sent. Thank you!"}
        else:
            logger.error("❌ Failed to send contact email — see the Resend service log for detail")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send email"
            )
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e!s}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        ) from e
