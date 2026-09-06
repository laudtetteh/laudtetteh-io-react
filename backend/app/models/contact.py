"""
Data models for contact-form submissions (#122).

Submissions used to exist only as an outbound email. If Resend accepted a
message and delivery then failed, the submission was gone with no trace in the
product -- which is the failure that costs most on a form whose entire job is
inbound recruiter contact.
"""

from datetime import UTC, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

DeliveryStatus = Literal["pending", "sent", "failed"]


class ContactSubmission(BaseModel):
    """
    A stored submission.

    `notification_*` fields describe the email sent to the site owner;
    `acknowledgement_*` describe the courtesy copy sent back to the submitter
    (#121). They are tracked separately on purpose: an acknowledgement that
    fails is a nuisance, but a notification that fails means the message was
    effectively never received, and the two should never be confused when
    reading the admin list.
    """

    name: str
    email: EmailStr
    message: str
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    # Retained for rate-limit forensics and abuse triage, never surfaced publicly.
    client_ip: str | None = None

    notification_status: DeliveryStatus = "pending"
    notification_message_id: str | None = None
    acknowledgement_status: DeliveryStatus = "pending"
    acknowledgement_message_id: str | None = None


class ContactSubmissionOut(BaseModel):
    """
    Admin-facing view.

    `client_ip` is deliberately absent: the admin list exists to read messages,
    not to profile the people who sent them, and the value stays in the
    document for abuse triage rather than being rendered in a browser.
    """

    id: str
    name: str
    email: EmailStr
    message: str
    submitted_at: datetime
    notification_status: DeliveryStatus
    acknowledgement_status: DeliveryStatus
