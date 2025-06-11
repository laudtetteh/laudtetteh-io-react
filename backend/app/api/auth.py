import logging

from core.auth import ADMIN_PASSWORD, ADMIN_USERNAME, create_access_token
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

logger = logging.getLogger(__name__)


async def login(form_data: OAuth2PasswordRequestForm = None) -> dict[str, str]:
    if form_data is None:
        form_data = Depends(OAuth2PasswordRequestForm)
    try:
        if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error("Login failed: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Login failed: {e!s}") from e
