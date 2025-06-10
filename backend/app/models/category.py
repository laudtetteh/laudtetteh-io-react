from pydantic import BaseModel, Field
from typing import Optional

class Category(BaseModel):
    name: str = Field(..., example="Python")
    group: Optional[str] = Field(default="Other", example="Tech")
    label: Optional[str] = Field(default=None, example="Python (Tech)")
