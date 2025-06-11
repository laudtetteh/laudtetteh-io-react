"""
Secure S3 upload URL generator.

This endpoint returns a pre-signed PUT URL for uploading a file to S3.
Access is protected using JWT admin authentication.
"""

import logging

from core.auth import verify_token
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from services.s3 import generate_presigned_upload_url

router = APIRouter()

logger = logging.getLogger(__name__)


class UploadRequest(BaseModel):
    filename: str
    content_type: str


@router.post("/api/upload-url")
async def upload_url(data: UploadRequest, token: str = Depends(verify_token)) -> dict[str, str]:
    """
    Generate a presigned URL for uploading to S3.
    Requires valid JWT token.
    """
    try:
        url, full_url = generate_presigned_upload_url(data.filename, data.content_type)
        logger.info("Generated S3 upload URL: %s", url)
        logger.info("File will be accessible at: %s", full_url)
        return {"upload_url": url, "file_url": full_url}
    except Exception as e:
        logger.error("Failed to generate presigned URL: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error generating URL: {e!s}") from e
