import html
import os

import resend
from core.logging import setup_logging

logger = setup_logging(name="contact-form")


def _escape(value: str) -> str:
    """
    Escape user-supplied text for inclusion in an HTML email body.

    These bodies are built by string interpolation, and `name` and `message`
    come straight off a public form. Before #121 they were interpolated raw:
    the blast radius was small (the notification lands in one mailbox, and mail
    clients strip scripts) but it was still HTML injection into a message a
    human opens, and the acknowledgement extends the same body shape to
    arbitrary visitors. Escape once, here, rather than trusting each call site.
    """
    return html.escape(value, quote=False).replace("\n", "<br>")


def _send(params: dict, *, label: str) -> tuple[bool, str | None]:
    """
    Send one email through Resend.

    Returns `(ok, message_id)` rather than raising, because the two callers
    want different failure behaviour: a failed notification is a real error,
    while a failed acknowledgement must not fail the request.
    """
    try:
        response = resend.Emails.send(params)
        message_id = response.get("id") if isinstance(response, dict) else None
        if message_id:
            logger.info(f"✅ {label} sent via Resend. Message ID: {message_id}")
            return True, message_id
        logger.error(f"❌ {label} failed — Resend returned no message ID. Response: {response}")
        return False, None
    except Exception as e:
        logger.error(f"❌ {label} failed — Resend API error: {e}")
        return False, None


def _config() -> tuple[str, str, str] | None:
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL")
    to_email = os.getenv("RESEND_TO_EMAIL")
    if not all([api_key, from_email, to_email]):
        logger.error(
            "❌ Missing Resend configuration. Check RESEND_API_KEY, "
            "RESEND_FROM_EMAIL, and RESEND_TO_EMAIL."
        )
        return None
    resend.api_key = api_key
    return api_key, from_email, to_email


def send_contact_email(name: str, email: str, message: str) -> tuple[bool, str | None]:
    """
    Notify the site owner of a new submission.

    This is the one that matters: if it fails, the message was effectively
    never received.
    """
    config = _config()
    if config is None:
        return False, None
    _, from_email, to_email = config

    html_body = f"""
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> {_escape(name)}</p>
    <p><strong>Email:</strong> {_escape(email)}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>{_escape(message)}</p>
    """

    return _send(
        {
            "from": from_email,
            "to": [to_email],
            "subject": f"💬 New message from {name} via laudtetteh.io",
            "html": html_body,
            "reply_to": email,
        },
        label="Contact notification",
    )


def send_contact_acknowledgement(name: str, email: str, message: str) -> tuple[bool, str | None]:
    """
    Send the submitter a copy of what they sent (#121).

    A portfolio contact form is often a recruiter's first interaction, and
    silence after submitting reads as broken. The copy of their own message is
    the point: it gives them a record, and it makes a delivery failure on our
    side visible to them rather than silent.

    Never called on the honeypot path -- replying to a bot would confirm the
    address to a spammer. The caller is responsible for that; see `contact.py`.
    """
    config = _config()
    if config is None:
        return False, None
    _, from_email, to_email = config

    html_body = f"""
    <p>Hi {_escape(name)},</p>
    <p>Thanks for getting in touch — your message reached me, and I'll reply personally.
    A copy is below for your records.</p>
    <hr>
    <p>{_escape(message)}</p>
    <hr>
    <p>— Laud Tetteh<br>
    <a href="https://laudtetteh.io">laudtetteh.io</a></p>
    """

    return _send(
        {
            "from": from_email,
            "to": [email],
            "subject": "Thanks for reaching out — I got your message",
            "html": html_body,
            # Replies go to the real inbox, not the no-reply sender.
            "reply_to": to_email,
        },
        label="Contact acknowledgement",
    )
