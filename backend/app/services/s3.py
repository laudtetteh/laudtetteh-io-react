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
    aws_secret_access_key=AWS_SECRET_KEY
)

UPLOAD_PREFIX = "uploads/"

def generate_presigned_upload_url(filename: str, content_type: str):
    # Split filename into name and extension
    if '.' in filename:
        name, ext = filename.rsplit('.', 1)
        ext = '.' + ext
    else:
        name, ext = filename, ''
    short_id = str(uuid4())[:6]
    key = f"{UPLOAD_PREFIX}{name}_{short_id}{ext}"
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": S3_BUCKET,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=3600
        )
        full_url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
        return url, full_url
    except Exception as e:
        raise RuntimeError(f"Error generating presigned URL: {str(e)}")

# New: List all images in uploads/ directory

def list_uploaded_images():
    try:
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=UPLOAD_PREFIX)
        images = []
        for obj in response.get('Contents', []):
            key = obj['Key']
            if key.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')):
                url = f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
                images.append({
                    'key': key,
                    'url': url,
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'].isoformat() if 'LastModified' in obj else None
                })
        return images
    except Exception as e:
        raise RuntimeError(f"Error listing images: {str(e)}")

def delete_image(key: str):
    try:
        s3_client.delete_object(Bucket=S3_BUCKET, Key=key)
        return True
    except Exception as e:
        raise RuntimeError(f"Error deleting image: {str(e)}")
