import logging
import os
from uuid import uuid4

import boto3

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-2")
S3_BUCKET = os.getenv("AWS_S3_BUCKET")

s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
)

UPLOAD_PREFIX = "uploads/"

logger = logging.getLogger(__name__)


def generate_presigned_upload_url(filename: str, content_type: str) -> tuple[str, str]:
    key = f"{UPLOAD_PREFIX}{uuid4()}_{filename}"
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": S3_BUCKET,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=3600,
        )
        full_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
        return url, full_url
    except Exception as e:
        logger.error("Failed to generate presigned URL: %s", str(e))
        raise Exception(f"Failed to generate presigned URL: {e!s}") from e
