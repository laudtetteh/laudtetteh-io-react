"""
Secure S3 upload URL generator.

This endpoint returns a pre-signed PUT URL for uploading a file to S3.
Access is protected using JWT admin authentication.
"""

import urllib.parse

from core.auth import verify_token
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel
from services.s3 import delete_image, generate_presigned_upload_url, list_uploaded_images

router = APIRouter()

class UploadRequest(BaseModel):
    filename: str
    content_type: str

@router.post("/upload-url")
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
        raise HTTPException(status_code=500, detail=f"Error generating URL: {str(e)}") from e

@router.get("/images")
def get_uploaded_images(token: str = Depends(verify_token)):
    """
    List all uploaded images in S3 uploads/ directory.
    Requires valid JWT token.
    """
    try:
        images = list_uploaded_images()
        return images
    except Exception as e:
        print("❌ Failed to list images:", str(e))
        raise HTTPException(status_code=500, detail=f"Error listing images: {str(e)}") from e

@router.delete("/images/{key:path}")
def delete_uploaded_image(key: str = Path(...), token: str = Depends(verify_token)):
    """
    Delete an image from S3 uploads/ directory by key.
    Requires valid JWT token.
    """
    try:
        # S3 keys may be URL-encoded; decode if needed
        decoded_key = urllib.parse.unquote(key)
        delete_image(decoded_key)
        return {"message": "Image deleted"}
    except Exception as e:
        print("❌ Failed to delete image:", str(e))
        raise HTTPException(status_code=500, detail=f"Error deleting image: {str(e)}") from e
