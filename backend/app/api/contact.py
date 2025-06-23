from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from services.email import send_contact_email
from core.logging import setup_logging

router = APIRouter()
logger = setup_logging(name="contact-form")

class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("/api/contact")
async def submit_contact(data: ContactSubmission, request: Request):
    """
    Handle contact form submission and send email notification.
    """
    logger.info(f"📨 Contact form submission received from {request.client.host}")
    logger.debug(f"Contact form data: Name={data.name}, Email={data.email}")

    try:
        success = send_contact_email(data.name, data.email, data.message)
        if success:
            logger.info(f"✅ Successfully sent contact email for {data.email}")
            return {"message": "✅ Message received and email sent. Thank you!"}
        else:
            logger.error(f"❌ Failed to send contact email for {data.email}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send email"
            )
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
