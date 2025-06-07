"""
Data models and validation schemas for the blog.

Defines Pydantic models for:
- BlogPost (core structure)
- BlogPostIn (input-only model for creation)
- BlogPostOut (optional, for controlled response shaping)
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class BlogPost(BaseModel):
    title: str
    slug: str
    summary: str
    content: str
    status: str  # "draft" or "published"
    categories: List[str] = []
    date: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Understanding FastAPI",
                "slug": "understanding-fastapi",
                "summary": "Intro to FastAPI with examples.",
                "content": "<p>This is the full article...</p>",
                "status": "<p>draft...</p>",
                "categories": "",
            }
        }

class BlogPostIn(BaseModel):
    title: str
    slug: str
    summary: str
    content: str
    status: str
    categories: List[str] = []


class BlogPostOut(BaseModel):
    title: str
    slug: str
    summary: str
    content: str
    date: datetime
    status: str = Field(default="draft")
    categories: List[str] = Field(default=[])
