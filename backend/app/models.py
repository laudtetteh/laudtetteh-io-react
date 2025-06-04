"""
Pydantic models for blog post data.

- BlogPostIn: used for incoming requests (create/update)
- BlogPost: used for responses, includes `date`
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BlogPostIn(BaseModel):
    title: str = Field(..., example="Understanding FastAPI")
    slug: str = Field(..., example="understanding-fastapi")
    summary: str = Field(..., example="Quick guide to FastAPI.")
    content: str = Field(..., example="<p>HTML content goes here</p>")

class BlogPost(BlogPostIn):
    date: Optional[datetime] = Field(default_factory=datetime.utcnow)
