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
from api.contact import router as contact_router
from core.db import connect_to_mongo, get_db

# ----------------------
# Logging Configuration
# ----------------------
logger = setup_logging(name="fastapi", log_level=os.getenv("LOG_LEVEL", "INFO"))

app = FastAPI(
    title="Portfolio API",
    description="Backend API for portfolio website",
    version="1.0.0"
)

# ----------------------
# CORS Setup
# ----------------------
# Explicit allowlist: production domains + local dev frontend. No wildcard.
ALLOWED_ORIGINS = [
    "https://laudtetteh.io",
    "https://www.laudtetteh.io",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# Startup Event
# ----------------------
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up FastAPI application")
    await connect_to_mongo()
    db = get_db()
    set_posts_collection(db["posts"])
    set_categories_collection(db["categories"])
    logger.info("Database connections established")

# ----------------------
# Shutdown Event
# ----------------------
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down FastAPI application")

# ----------------------
# Middleware for Request Logging
# ----------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    if request.url.path == "/healthz":
        return await call_next(request)
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

# ----------------------
# Blog + Upload + Contact Routers
# ----------------------
app.include_router(blog_router)
app.include_router(upload_router, prefix="/api")
app.include_router(contact_router)

# ----------------------
# Login Endpoint (JWT)
# ----------------------
@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Admin login. Issues JWT on correct credentials.
    """
    logger.debug(f"Login attempt for user: {form_data.username}")
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        logger.warning(f"Failed login attempt for user: {form_data.username}")
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    access_token = create_access_token(data={"sub": form_data.username})
    logger.info(f"Successful login for user: {form_data.username}")
    return { "access_token": access_token, "token_type": "bearer" }

@app.get("/healthz")
def healthz():
    return {"status": "ok"}
