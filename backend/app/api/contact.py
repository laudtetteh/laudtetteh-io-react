from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from services.email import send_email_via_mailgun
import logging

router = APIRouter()
logger = logging.getLogger("contact-form")

class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("/api/contact")
async def submit_contact(data: ContactSubmission, request: Request):
    logger.info(f"📨 Contact form received from {request.client.host}")
    logger.info(f"Name: {data.name}, Email: {data.email}")

    success = send_email_via_mailgun(data.name, data.email, data.message)

    if success:
        return { "message": "✅ Message received and email sent. Thank you!" }
    else:
        raise HTTPException(status_code=500, detail="❌ Failed to send email via Mailgun.")
