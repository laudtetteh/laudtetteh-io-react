"""Public site settings and authenticated admin controls."""

from core.auth import verify_token
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter()
settings_collection = None

CV_LINKS_SETTING_KEY = "cv_links_enabled"
DEFAULT_CV_LINKS_ENABLED = True


def set_settings_collection(collection):
    global settings_collection
    settings_collection = collection


class CvLinksSettingUpdate(BaseModel):
    enabled: bool


async def get_cv_links_enabled() -> bool:
    if settings_collection is None:
        return DEFAULT_CV_LINKS_ENABLED

    document = await settings_collection.find_one({"key": CV_LINKS_SETTING_KEY})
    if not document or not isinstance(document.get("value"), bool):
        return DEFAULT_CV_LINKS_ENABLED
    return document["value"]


@router.get("/settings/cv-links")
async def get_public_cv_links_setting():
    return {"enabled": await get_cv_links_enabled()}


@router.get("/admin/settings/cv-links", dependencies=[Depends(verify_token)])
async def get_admin_cv_links_setting():
    return {"enabled": await get_cv_links_enabled()}


@router.patch("/admin/settings/cv-links", dependencies=[Depends(verify_token)])
async def update_admin_cv_links_setting(data: CvLinksSettingUpdate):
    if settings_collection is not None:
        await settings_collection.update_one(
            {"key": CV_LINKS_SETTING_KEY},
            {"$set": {"key": CV_LINKS_SETTING_KEY, "value": data.enabled}},
            upsert=True,
        )
    return {"enabled": data.enabled}
