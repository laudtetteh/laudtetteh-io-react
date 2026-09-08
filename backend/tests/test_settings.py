from api.settings import set_settings_collection
from core.auth import verify_token
from httpx import ASGITransport, AsyncClient
from main import app


class FakeSettingsCollection:
    def __init__(self):
        self.document = None

    async def find_one(self, _query):
        return self.document

    async def update_one(self, _query, update, upsert=False):
        assert upsert is True
        self.document = update["$set"]


async def _client():
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def test_public_cv_links_default_to_enabled():
    set_settings_collection(None)
    async with await _client() as client:
        response = await client.get("/api/settings/cv-links")

    assert response.status_code == 200
    assert response.json() == {"enabled": True}


async def test_admin_can_toggle_public_cv_links():
    collection = FakeSettingsCollection()
    set_settings_collection(collection)
    app.dependency_overrides[verify_token] = lambda: None
    try:
        async with await _client() as client:
            update_response = await client.patch(
                "/api/admin/settings/cv-links",
                json={"enabled": False},
                headers={"Authorization": "Bearer token"},
            )
            public_response = await client.get("/api/settings/cv-links")
            admin_response = await client.get(
                "/api/admin/settings/cv-links",
                headers={"Authorization": "Bearer token"},
            )
    finally:
        app.dependency_overrides.clear()
        set_settings_collection(None)

    assert update_response.status_code == 200
    assert update_response.json() == {"enabled": False}
    assert public_response.json() == {"enabled": False}
    assert admin_response.json() == {"enabled": False}


async def test_admin_cv_links_setting_requires_authentication():
    set_settings_collection(None)
    async with await _client() as client:
        response = await client.get("/api/admin/settings/cv-links")

    assert response.status_code == 401
