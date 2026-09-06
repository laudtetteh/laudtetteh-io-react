"""
One-time migration for the public CV.

Usage:
  CONFIRM_PUBLIC_CV_HAS_NO_PHONE=true \\
    python backend/scripts/migrate_current_cv.py /path/to/current.pdf

The API upload flow cannot safely infer that an arbitrary PDF has no phone
number. This script keeps the same explicit operator confirmation required by
the admin UI while moving the current file into S3-backed metadata.
"""

import asyncio
import mimetypes
import os
import sys
from datetime import datetime
from pathlib import Path
from uuid import uuid4

import boto3
import pytz
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

CV_MAX_SIZE_BYTES = 5 * 1024 * 1024
CV_PREFIX = "cv/"


def require_confirmed_public_cv():
    if os.getenv("CONFIRM_PUBLIC_CV_HAS_NO_PHONE") != "true":
        raise SystemExit("Set CONFIRM_PUBLIC_CV_HAS_NO_PHONE=true after checking the public CV.")


def get_pdf_path() -> Path:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python backend/scripts/migrate_current_cv.py /path/to/current.pdf")
    path = Path(sys.argv[1]).expanduser().resolve()
    if not path.is_file():
        raise SystemExit(f"CV file not found: {path}")
    if path.suffix.lower() != ".pdf":
        raise SystemExit("CV file must be a PDF.")
    size = path.stat().st_size
    if size <= 0 or size > CV_MAX_SIZE_BYTES:
        raise SystemExit("CV file must be between 1 byte and 5 MB.")
    return path


async def main():
    load_dotenv()
    require_confirmed_public_cv()
    path = get_pdf_path()

    bucket = os.getenv("AWS_S3_BUCKET")
    region = os.getenv("AWS_REGION", "us-east-2")
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db_name = os.getenv("MONGO_DB_NAME", "laud_blog")
    if not bucket:
        raise SystemExit("AWS_S3_BUCKET is required.")

    content_type = mimetypes.guess_type(path.name)[0] or "application/pdf"
    if content_type != "application/pdf":
        raise SystemExit("CV content type must resolve to application/pdf.")

    safe_stem = "".join(
        char if char.isalnum() or char in ("-", "_") else "-"
        for char in path.stem
    ).strip("-_") or "cv"
    key = f"{CV_PREFIX}{safe_stem}_{uuid4().hex[:8]}.pdf"

    s3_client = boto3.client(
        "s3",
        region_name=region,
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )
    s3_client.upload_file(
        str(path),
        bucket,
        key,
        ExtraArgs={"ContentType": "application/pdf"},
    )

    file_url = f"https://{bucket}.s3.{region}.amazonaws.com/{key}"
    client = AsyncIOMotorClient(mongo_uri)
    collection = client[mongo_db_name]["cv_uploads"]
    await collection.update_many({"is_current": True}, {"$set": {"is_current": False}})
    await collection.insert_one({
        "filename": path.name,
        "content_type": "application/pdf",
        "size": path.stat().st_size,
        "key": key,
        "file_url": file_url,
        "uploaded_at": datetime.now(pytz.utc),
        "is_current": True,
        "phone_number_confirmed_absent": True,
    })
    client.close()
    print(f"Migrated current CV to {file_url}")


if __name__ == "__main__":
    asyncio.run(main())
