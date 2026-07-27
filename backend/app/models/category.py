
from pydantic import BaseModel, Field


class Category(BaseModel):
    name: str = Field(..., example="Python")
    group: str | None = Field(default="Other", example="Tech")
    label: str | None = Field(default=None, example="Python (Tech)")
