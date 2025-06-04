"""
FastAPI entry point:
- Includes blog routes
- Contact form email via Mailgun
"""

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import os
import logging
import requests
from blog_api import router as blog_router

app = FastAPI()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("contact-form")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use real domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount blog routes
app.include_router(blog_router)

# Contact form schema
class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    message: str

def send_email_via_mailgun(name: str, email: str, message: str) -> bool:
    """Send email using Mailgun REST API."""
    mailgun_domain = os.getenv("MAILGUN_DOMAIN")
    mailgun_api_key = os.getenv("MAILGUN_API_KEY")
    mailgun_from = os.getenv("MAILGUN_FROM")
    mailgun_to = os.getenv("MAILGUN_TO")

    if not all([mailgun_domain, mailgun_api_key, mailgun_from, mailgun_to]):
        print("❌ Missing Mailgun config")
        return False

    try:
        response = requests.post(
            f"https://api.mailgun.net/v3/{mailgun_domain}/messages",
            auth=("api", mailgun_api_key),
            data={
                "from": mailgun_from,
                "to": [mailgun_to],
                "subject": "💬 New Contact Form Message",
                "text": f"From: {name} <{email}>\n\n{message}"
            },
        )
        print(f"📤 Mailgun response: {response.status_code} - {response.text}")
        return response.status_code in [status.HTTP_200_OK, status.HTTP_202_ACCEPTED]
    except Exception as e:
        print(f"❌ Mailgun error: {e}")
        return False

@app.post("/api/contact")
async def submit_contact(data: ContactSubmission, request: Request):
    logger.info(f"📨 Contact form received from {request.client.host}")
    logger.info(f"Name: {data.name}, Email: {data.email}")

    success = send_email_via_mailgun(data.name, data.email, data.message)

    if success:
        return { "message": "✅ Message received and email sent. Thank you!" }
    else:
        raise HTTPException(status_code=500, detail="❌ Failed to send email via Mailgun.")
