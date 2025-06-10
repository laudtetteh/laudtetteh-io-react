"""
FastAPI app entry point.

Handles:
- CORS setup
- Contact form (via Mailgun)
- Blog routes (mounted from blog_api)
- Auth
- S3 upload
"""

from fastapi import FastAPI, HTTPException, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from core.auth import Token, create_access_token, verify_token, ADMIN_USERNAME, ADMIN_PASSWORD
from pydantic import BaseModel, EmailStr
import os
from core.logging import setup_logging

from api.blog import router as blog_router, set_posts_collection, set_categories_collection
from api.s3 import router as upload_router
from core.db import connect_to_mongo, get_db
from api.contact import router as contact_router

app = FastAPI()

# ----------------------
# Logging Configuration
# ----------------------
logger = setup_logging()

# ----------------------
# CORS Setup
# ----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# MongoDB Startup Hook
# ----------------------
@app.on_event("startup")
async def init_db():
    await connect_to_mongo()
    db = get_db()
    set_posts_collection(db["posts"])
    set_categories_collection(db["categories"])

# ----------------------
# Blog + Upload + Contact Routers
# ----------------------
app.include_router(blog_router)
app.include_router(upload_router)
app.include_router(contact_router)

# ----------------------
# Login Endpoint (JWT)
# ----------------------
@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Admin login. Issues JWT on correct credentials.
    """
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": form_data.username})
    return { "access_token": access_token, "token_type": "bearer" }
