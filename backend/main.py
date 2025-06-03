from fastapi import status
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import os
import logging
import requests

app = FastAPI()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("contact-form")

# Allow CORS from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Blog Post Endpoints
# --------------------
posts = [
    {
        "title": "Blog Post 1",
        "slug": "first-post",
        "summary": "This is a short summary of the first post.",
        "content": "<p>This is the full content of the first blog post. You can use HTML here.</p>",
        "date": "2024-01-01"
    },
    {
        "title": "Blog Post 2",
        "slug": "second-post",
        "summary": "Another brief summary.",
        "content": "<p>This is the second post’s content. Lots of interesting insights go here.</p>",
        "date": "2024-02-01"
    },
    {
        "title": "Blog Post 3",
        "slug": "third-post",
        "summary": "A summary of the third post.",
        "content": "<p>This is the content of blog post number three.</p>",
        "date": "2024-03-01"
    }
]

@app.get("/api/posts")
def get_all_posts():
    return [
        {
            "title": post["title"],
            "slug": post["slug"],
            "summary": post["summary"],
            "date": post["date"]
        }
        for post in posts
    ]

@app.get("/api/posts/{slug}")
def get_post_by_slug(slug: str):
    for post in posts:
        if post["slug"] == slug:
            return post
    raise HTTPException(status_code=404, detail="Post not found")

# --------------------
# Contact Form Email Support
# --------------------
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
        return response.status_code == status.HTTP_200_OK or response.status_code == status.HTTP_202_ACCEPTED
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
