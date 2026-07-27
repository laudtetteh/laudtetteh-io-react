import os


class Settings:
    AWS_ACCESS_KEY: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-2")
    S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "")

settings = Settings()
