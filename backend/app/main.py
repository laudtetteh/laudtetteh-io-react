"""
FastAPI app entry point.

Handles:
- CORS setup
- Contact form (via Mailgun)
- Blog routes (mounted from blog_api)
- Auth
- S3 upload
"""

from api.blog import router as blog_router
from api.blog import set_categories_collection, set_posts_collection
from api.contact import router as contact_router
from api.s3 import router as upload_router
from core.auth import ADMIN_PASSWORD, ADMIN_USERNAME, Token, create_access_token
from core.db import connect_to_mongo, get_db
from core.logging import setup_logging
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import cast, Any

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
async def init_db() -> None:
    await connect_to_mongo()
    db = get_db()
    if db is None:
        raise RuntimeError("Database connection failed during startup.")
    db = cast(Any, db)
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
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> dict[str, str]:
    """
    Admin login. Issues JWT on correct credentials.
    """
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}
