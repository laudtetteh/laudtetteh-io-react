from typing import Optional

from pydantic import BaseModel, Field


class Category(BaseModel):
    name: str = Field(..., example="Python")
    group: Optional[str] = Field(default="Other", example="Tech")
    label: Optional[str] = Field(default=None, example="Python (Tech)")
    posts: list[str] = Field(default=[])
