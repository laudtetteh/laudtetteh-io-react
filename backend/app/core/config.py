import os

class Settings:
    AWS_ACCESS_KEY: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-2")
    S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "")
    MAILGUN_DOMAIN: str = os.getenv("MAILGUN_DOMAIN", "")
    MAILGUN_API_KEY: str = os.getenv("MAILGUN_API_KEY", "")
    MAILGUN_FROM: str = os.getenv("MAILGUN_FROM", "")
    MAILGUN_TO: str = os.getenv("MAILGUN_TO", "")

settings = Settings()
