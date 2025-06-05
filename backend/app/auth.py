"""
JWT authentication utilities for admin access.

Handles token creation and verification using a shared secret.
Provides OAuth2 bearer token dependency and validates user identity.
"""

from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import os

# Configuration from environment
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2 scheme used in protected endpoints
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# Dummy admin credentials from environment
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "password123")

# ------------------------
# Pydantic Token Schema
# ------------------------

class Token(BaseModel):
    access_token: str
    token_type: str

# ------------------------
# Token Utility Functions
# ------------------------

def create_access_token(data: dict) -> str:
    """
    Create a JWT access token with embedded payload and expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    """
    Dependency to verify token validity and extract username.
    Raises HTTP 401 if token is invalid or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
