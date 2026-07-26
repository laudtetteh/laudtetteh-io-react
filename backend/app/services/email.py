import os

import resend
from core.logging import setup_logging

logger = setup_logging(name="contact-form")

def send_contact_email(name: str, email: str, message: str) -> bool:
    """
    Sends a contact form email using the Resend API.
    """
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL")
    to_email = os.getenv("RESEND_TO_EMAIL")

    if not all([api_key, from_email, to_email]):
        logger.error(
            "❌ Missing Resend configuration. "
            "Check RESEND_API_KEY, RESEND_FROM_EMAIL, and RESEND_TO_EMAIL."
        )
        return False

    resend.api_key = api_key

    html_body = f"""
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>{message.replace(chr(10), "<br>")}</p>
    """

    try:
        params = {
            "from": from_email,
            "to": [to_email],
            "subject": f"💬 New message from {name} via laudtetteh.io",
            "html": html_body,
            "reply_to": email,
        }
        response = resend.Emails.send(params)
        
        # Check if the response indicates success
        if response.get("id"):
            logger.info(
                f"✅ Email sent successfully to {to_email} via Resend. "
                f"Message ID: {response['id']}"
            )
            return True
        else:
            logger.error(f"❌ Failed to send email via Resend. Response: {response}")
            return False

    except Exception as e:
        logger.error(f"❌ Resend API error: {e}")
        return False
