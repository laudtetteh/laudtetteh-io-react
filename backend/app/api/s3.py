"""
Secure S3 upload URL generator.

This endpoint returns a pre-signed PUT URL for uploading a file to S3.
Access is protected using JWT admin authentication.
"""

import urllib.parse
from datetime import datetime
from typing import Literal

import pytz
from core.auth import verify_token
from fastapi import APIRouter, Depends, HTTPException, Path
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from services.s3 import (
    CV_PREFIX,
    delete_image,
    generate_presigned_download_url,
    generate_presigned_upload_url,
    list_uploaded_images,
)

router = APIRouter()
cv_uploads_collection = None

CV_CONTENT_TYPE = "application/pdf"
CV_MAX_SIZE_BYTES = 5 * 1024 * 1024


def set_cv_uploads_collection(collection):
    global cv_uploads_collection
    cv_uploads_collection = collection

class UploadRequest(BaseModel):
    filename: str
    content_type: str


class CvUploadUrlRequest(UploadRequest):
    size: int


class CvPublishRequest(BaseModel):
    filename: str
    content_type: Literal["application/pdf"]
    size: int
    key: str
    file_url: str
    phone_number_confirmed_absent: bool


def validate_cv_upload(filename: str, content_type: str, size: int):
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="CV upload must be a PDF")
    if content_type != CV_CONTENT_TYPE:
        raise HTTPException(
            status_code=400,
            detail="CV upload content type must be application/pdf",
        )
    if size <= 0 or size > CV_MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="CV upload must be between 1 byte and 5 MB")


async def get_current_cv_document():
    if cv_uploads_collection is None:
        raise HTTPException(status_code=404, detail="No CV has been uploaded")
    return await cv_uploads_collection.find_one({"is_current": True})


def serialize_cv(document):
    return {
        "filename": document["filename"],
        "uploaded_at": document["uploaded_at"].isoformat(),
        "size": document["size"],
        "content_type": document["content_type"],
        "download_url": "/api/cv/download",
        "phone_number_confirmed_absent": document.get("phone_number_confirmed_absent", False),
    }


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


@router.get("/cv")
async def get_current_cv():
    """
    Return public metadata for the current CV.
    The file itself is served through /api/cv/download so the public URL stays stable.
    """
    document = await get_current_cv_document()
    if not document:
        raise HTTPException(status_code=404, detail="No CV has been uploaded")
    return serialize_cv(document)


@router.get("/cv/download")
async def download_current_cv():
    """
    Stable public CV URL. Redirects to a signed URL for the current retained S3 version.
    """
    document = await get_current_cv_document()
    if not document:
        raise HTTPException(status_code=404, detail="No CV has been uploaded")
    key = document.get("key", "")
    if (
        not isinstance(key, str)
        or not key.startswith(CV_PREFIX)
        or not key.lower().endswith(".pdf")
    ):
        raise HTTPException(status_code=500, detail="Current CV has an invalid storage key")
    try:
        download_url = generate_presigned_download_url(key)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail="Unable to prepare the CV download") from e
    return RedirectResponse(download_url, status_code=307)


@router.get("/admin/cv/versions", dependencies=[Depends(verify_token)])
async def list_cv_versions():
    if cv_uploads_collection is None:
        return []
    versions = await cv_uploads_collection.find().sort("uploaded_at", -1).to_list(100)
    return [
        serialize_cv(version) | {"is_current": version.get("is_current", False)}
        for version in versions
    ]


@router.post("/cv/upload-url")
def get_cv_upload_url(data: CvUploadUrlRequest, token: str = Depends(verify_token)):
    """
    Generate a presigned URL for a PDF CV upload.
    """
    validate_cv_upload(data.filename, data.content_type, data.size)
    try:
        url, full_url = generate_presigned_upload_url(
            data.filename,
            data.content_type,
            prefix=CV_PREFIX,
        )
        key = full_url.split(f"{CV_PREFIX}", 1)[1]
        return {
            "upload_url": url,
            "file_url": full_url,
            "key": f"{CV_PREFIX}{key}",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating CV upload URL: {str(e)}",
        ) from e


@router.post("/cv", dependencies=[Depends(verify_token)])
async def publish_cv(data: CvPublishRequest):
    """
    Mark a retained S3 PDF as the current public CV.
    """
    if cv_uploads_collection is None:
        raise HTTPException(status_code=500, detail="CV upload storage is not configured")
    validate_cv_upload(data.filename, data.content_type, data.size)
    if not data.key.startswith(CV_PREFIX) or not data.key.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="CV object must live under the cv/ S3 prefix")
    if not data.phone_number_confirmed_absent:
        raise HTTPException(
            status_code=400,
            detail="Confirm the public CV does not contain a phone number",
        )

    now = datetime.now(pytz.utc)
    await cv_uploads_collection.update_many({"is_current": True}, {"$set": {"is_current": False}})
    document = {
        "filename": data.filename,
        "content_type": data.content_type,
        "size": data.size,
        "key": data.key,
        "file_url": data.file_url,
        "uploaded_at": now,
        "is_current": True,
        "phone_number_confirmed_absent": True,
    }
    await cv_uploads_collection.insert_one(document)
    return serialize_cv(document) | {"is_current": True}

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
