from datetime import UTC, datetime

from api.s3 import set_cv_uploads_collection
from core.auth import verify_token
from httpx import ASGITransport, AsyncClient
from main import app


class FakeInsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class FakeCursor:
    def __init__(self, documents):
        self.documents = documents

    def sort(self, *_args):
        self.documents = sorted(
            self.documents,
            key=lambda document: document["uploaded_at"],
            reverse=True,
        )
        return self

    async def to_list(self, _limit):
        return self.documents


class FakeCvCollection:
    def __init__(self):
        self.documents: list[dict] = []

    async def find_one(self, query):
        for document in self.documents:
            if all(document.get(key) == value for key, value in query.items()):
                return document
        return None

    def find(self):
        return FakeCursor(list(self.documents))

    async def update_many(self, query, update):
        for document in self.documents:
            if all(document.get(key) == value for key, value in query.items()):
                document.update(update["$set"])

    async def insert_one(self, document):
        self.documents.append(document)
        return FakeInsertResult("cv-id")


async def _client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


def _auth_override():
    return None


async def test_public_cv_metadata_404s_when_no_cv_uploaded():
    set_cv_uploads_collection(FakeCvCollection())
    async with await _client() as client:
        response = await client.get("/api/cv")

    assert response.status_code == 404


async def test_cv_upload_url_rejects_non_pdf(monkeypatch):
    app.dependency_overrides[verify_token] = _auth_override
    set_cv_uploads_collection(FakeCvCollection())

    async with await _client() as client:
        response = await client.post(
            "/api/cv/upload-url",
            json={"filename": "resume.txt", "content_type": "text/plain", "size": 100},
            headers={"Authorization": "Bearer token"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 400
    assert response.json()["detail"] == "CV upload must be a PDF"


async def test_cv_publish_requires_no_phone_confirmation():
    app.dependency_overrides[verify_token] = _auth_override
    set_cv_uploads_collection(FakeCvCollection())

    async with await _client() as client:
        response = await client.post(
            "/api/cv",
            json={
                "filename": "Laud-Tetteh-Resume.pdf",
                "content_type": "application/pdf",
                "size": 1000,
                "key": "cv/Laud-Tetteh-Resume_abc123.pdf",
                "file_url": "https://bucket.s3.us-east-2.amazonaws.com/cv/Laud-Tetteh-Resume_abc123.pdf",
                "phone_number_confirmed_absent": False,
            },
            headers={"Authorization": "Bearer token"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 400
    assert response.json()["detail"] == "Confirm the public CV does not contain a phone number"


async def test_publishing_cv_sets_current_and_retains_previous_versions():
    app.dependency_overrides[verify_token] = _auth_override
    collection = FakeCvCollection()
    collection.documents.append({
        "filename": "old.pdf",
        "content_type": "application/pdf",
        "size": 1000,
        "key": "cv/old.pdf",
        "file_url": "https://bucket.example/cv/old.pdf",
        "uploaded_at": datetime(2026, 1, 1, tzinfo=UTC),
        "is_current": True,
        "phone_number_confirmed_absent": True,
    })
    set_cv_uploads_collection(collection)

    payload = {
        "filename": "Laud-Tetteh-Resume.pdf",
        "content_type": "application/pdf",
        "size": 2000,
        "key": "cv/Laud-Tetteh-Resume_abc123.pdf",
        "file_url": "https://bucket.example/cv/Laud-Tetteh-Resume_abc123.pdf",
        "phone_number_confirmed_absent": True,
    }
    async with await _client() as client:
        publish_response = await client.post(
            "/api/cv",
            json=payload,
            headers={"Authorization": "Bearer token"},
        )
        public_response = await client.get("/api/cv")
        redirect_response = await client.get("/api/cv/download", follow_redirects=False)
        versions_response = await client.get(
            "/api/admin/cv/versions",
            headers={"Authorization": "Bearer token"},
        )

    app.dependency_overrides.clear()

    assert publish_response.status_code == 200
    assert public_response.json()["filename"] == "Laud-Tetteh-Resume.pdf"
    assert public_response.json()["download_url"] == "/api/cv/download"
    assert redirect_response.status_code == 307
    assert redirect_response.headers["location"] == payload["file_url"]
    assert len(collection.documents) == 2
    assert collection.documents[0]["is_current"] is False
    assert collection.documents[1]["is_current"] is True
    assert [version["filename"] for version in versions_response.json()] == [
        "Laud-Tetteh-Resume.pdf",
        "old.pdf",
    ]
