"""
Secure S3 upload URL generator.

This endpoint returns a pre-signed PUT URL for uploading a file to S3.
Access is protected using JWT admin authentication.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth import verify_token
import boto3
import os
from uuid import uuid4

router = APIRouter()

# Load S3 config from environment
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET = os.getenv("AWS_S3_BUCKET")

# Initialize boto3 S3 client
s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

class UploadRequest(BaseModel):
    filename: str
    content_type: str

@router.post("/api/upload-url")
def get_upload_url(data: UploadRequest, token: str = Depends(verify_token)):
    """
    Generate a presigned URL for uploading to S3.
    Requires valid JWT token.
    """
    key = f"uploads/{uuid4()}_{data.filename}"

    try:
        url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": S3_BUCKET,
                "Key": key,
                "ContentType": data.content_type,
                "ACL": "public-read"
            },
            ExpiresIn=3600
        )
        full_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
        return { "upload_url": url, "file_url": full_url }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating URL: {e}")
