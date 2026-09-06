"""
Contact form: persistence (#122) and acknowledgement (#121).

The cases that matter are the ones where the two emails behave *differently*.
A failed notification means the message was effectively never received and must
surface as an error; a failed acknowledgement is a courtesy that must never
cost the sender their submission. The honeypot path must do neither, and must
store nothing -- replying to a bot confirms the address to a spammer.
"""

import api.contact as contact_module
import pytest
from httpx import ASGITransport, AsyncClient
from main import app


class FakeInsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class FakeCollection:
    """Minimal stand-in for the motor collection: records what it was asked to do."""

    def __init__(self):
        self.inserted: list[dict] = []
        self.updates: list[tuple[dict, dict]] = []

    async def insert_one(self, document):
        self.inserted.append(document)
        return FakeInsertResult("64b7f9c2e4b0f5a3d2c1b0a9")

    async def update_one(self, query, update):
        self.updates.append((query, update))
        return None


@pytest.fixture
def collection(monkeypatch):
    fake = FakeCollection()
    contact_module.set_submissions_collection(fake)
    # Rate limiting is per-IP and module-level; tests share a client IP.
    contact_module._submission_log.clear()
    yield fake
    contact_module.set_submissions_collection(None)


def _set_email(monkeypatch, *, notify=(True, "notify-id"), ack=(True, "ack-id")):
    calls = {"notify": 0, "ack": 0}

    def fake_notify(name, email, message):
        calls["notify"] += 1
        if isinstance(notify, Exception):
            raise notify
        return notify

    def fake_ack(name, email, message):
        calls["ack"] += 1
        if isinstance(ack, Exception):
            raise ack
        return ack

    monkeypatch.setattr(contact_module, "send_contact_email", fake_notify)
    monkeypatch.setattr(contact_module, "send_contact_acknowledgement", fake_ack)
    return calls


async def _post(payload):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        return await client.post("/api/contact", json=payload)


VALID = {"name": "Jordan Reyes", "email": "jordan@example.com", "message": "Hello there."}


async def test_submission_is_stored_and_both_emails_sent(collection, monkeypatch):
    calls = _set_email(monkeypatch)
    response = await _post(VALID)

    assert response.status_code == 200
    assert len(collection.inserted) == 1
    stored = collection.inserted[0]
    assert stored["email"] == "jordan@example.com"
    assert stored["notification_status"] == "pending"  # written before sending

    assert calls == {"notify": 1, "ack": 1}
    recorded = [u[1]["$set"] for u in collection.updates]
    assert {"notification_status": "sent", "notification_message_id": "notify-id"} in recorded
    assert {"acknowledgement_status": "sent", "acknowledgement_message_id": "ack-id"} in recorded


async def test_submission_is_stored_even_when_the_notification_fails(collection, monkeypatch):
    _set_email(monkeypatch, notify=(False, None))
    response = await _post(VALID)

    # The caller is told it failed...
    assert response.status_code == 500
    # ...but the message is not lost, which is the entire point of #122.
    assert len(collection.inserted) == 1
    recorded = [u[1]["$set"] for u in collection.updates]
    assert {"notification_status": "failed", "notification_message_id": None} in recorded


async def test_acknowledgement_failure_does_not_fail_the_request(collection, monkeypatch):
    calls = _set_email(monkeypatch, ack=(False, None))
    response = await _post(VALID)

    assert response.status_code == 200
    assert calls["ack"] == 1
    recorded = [u[1]["$set"] for u in collection.updates]
    assert {"acknowledgement_status": "failed", "acknowledgement_message_id": None} in recorded


async def test_acknowledgement_raising_does_not_fail_the_request(collection, monkeypatch):
    _set_email(monkeypatch, ack=RuntimeError("resend exploded"))
    response = await _post(VALID)

    assert response.status_code == 200
    recorded = [u[1]["$set"] for u in collection.updates]
    assert {"acknowledgement_status": "failed", "acknowledgement_message_id": None} in recorded


async def test_honeypot_stores_nothing_and_sends_nothing(collection, monkeypatch):
    calls = _set_email(monkeypatch)
    response = await _post({**VALID, "website": "http://spam.example"})

    # Fake success so the bot does not learn to avoid the field.
    assert response.status_code == 200
    assert collection.inserted == []
    assert calls == {"notify": 0, "ack": 0}


async def test_submission_survives_a_storage_outage(monkeypatch):
    """Losing the record is bad; refusing a message we could still email is worse."""
    contact_module.set_submissions_collection(None)
    contact_module._submission_log.clear()
    calls = _set_email(monkeypatch)

    response = await _post(VALID)

    assert response.status_code == 200
    assert calls == {"notify": 1, "ack": 1}
