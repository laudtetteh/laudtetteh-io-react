"""
FastAPI app entry point.

Handles:
- CORS setup
- Contact form (via Mailgun)
- Blog routes (mounted from blog_api)
"""

from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from auth import Token, create_access_token, verify_token, ADMIN_USERNAME, ADMIN_PASSWORD
from pydantic import BaseModel, EmailStr
import os, logging, requests
from blog_api import router as blog_router, set_posts_collection
from s3_upload import router as upload_router
from db import connect_to_mongo, get_db

app = FastAPI()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("contact-form")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Blog API routes
app.include_router(blog_router)

# ----------------
# Contact Form
# ----------------
class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    message: str

def send_email_via_mailgun(name: str, email: str, message: str) -> bool:
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
                "from": f"{mailgun_from}",
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


@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Admin login. Issues JWT on correct credentials.
    """
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.on_event("startup")
async def init_db():
    await connect_to_mongo()
    db = get_db()
    set_posts_collection(db["posts"])
