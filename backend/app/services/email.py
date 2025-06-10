import os, requests
from fastapi import status

def send_email_via_mailgun(name: str, email: str, message: str) -> bool:
    mailgun_domain = os.getenv("MAILGUN_DOMAIN")
    mailgun_api_key = os.getenv("MAILGUN_API_KEY")
    mailgun_from = os.getenv("MAILGUN_FROM")
    mailgun_to = os.getenv("MAILGUN_TO")

    if not all([mailgun_domain, mailgun_api_key, mailgun_from, mailgun_to]):
        print("❌ Missing Mailgun config")
        return False

    try:
        response = requests.post(
            f"https://api.mailgun.net/v3/{mailgun_domain}/messages",
            auth=("api", mailgun_api_key),
            data={
                "from": f"{mailgun_from}",
                "to": [mailgun_to],
                "subject": "💬 New Contact Form Message",
                "text": f"From: {name} <{email}>\n\n{message}"
            },
        )
        print(f"📤 Mailgun response: {response.status_code} - {response.text}")
        return response.status_code in [status.HTTP_200_OK, status.HTTP_202_ACCEPTED]
    except Exception as e:
        print(f"❌ Mailgun error: {e}")
        return False
