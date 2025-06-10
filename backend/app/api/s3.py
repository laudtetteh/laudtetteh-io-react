"""
Secure S3 upload URL generator.

This endpoint returns a pre-signed PUT URL for uploading a file to S3.
Access is protected using JWT admin authentication.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from core.auth import verify_token
from services.s3 import generate_presigned_upload_url

router = APIRouter()

class UploadRequest(BaseModel):
    filename: str
    content_type: str

@router.post("/api/upload-url")
def get_upload_url(data: UploadRequest, token: str = Depends(verify_token)):
    """
    Generate a presigned URL for uploading to S3.
    Requires valid JWT token.
    """
    try:
        url, full_url = generate_presigned_upload_url(data.filename, data.content_type)
        print("🪪 Generated S3 upload URL:", url)
        print("🌍 File will be accessible at:", full_url)
        return {
            "upload_url": url,
            "file_url": full_url
        }
    except Exception as e:
        print("❌ Failed to generate presigned URL:", str(e))
        raise HTTPException(status_code=500, detail=f"Error generating URL: {str(e)}")
