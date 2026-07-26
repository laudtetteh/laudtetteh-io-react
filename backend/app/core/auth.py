"""
JWT authentication utilities for admin access.

Handles token creation and verification using a shared secret.
Provides OAuth2 bearer token dependency and validates user identity.
"""

import os
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel

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
    print("🔐 Verifying token...")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("✅ JWT payload:", payload)
        username = payload.get("sub")
        if username != ADMIN_USERNAME:
            print(f"❌ Token 'sub' does not match admin. Got {username}, expected {ADMIN_USERNAME}")
            raise credentials_exception
    except JWTError as e:
        print(f"❌ JWTError: {str(e)}")
        raise credentials_exception from e
