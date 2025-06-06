"""
Data models and validation schemas for the blog.

Defines Pydantic models for:
- BlogPost (core structure)
- BlogPostIn (input-only model for creation)
- BlogPostOut (optional, for controlled response shaping)
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BlogPost(BaseModel):
    title: str = Field(..., example="Understanding FastAPI")
    slug: str = Field(..., example="understanding-fastapi")
    summary: str = Field(..., example="Intro to FastAPI.")
    content: str = Field(..., example="<p>HTML content here</p>")
    date: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Understanding FastAPI",
                "slug": "understanding-fastapi",
                "summary": "Intro to FastAPI with examples.",
                "content": "<p>This is the full article...</p>",
            }
        }

class BlogPostIn(BaseModel):
    title: str = Field(..., example="New Blog Post")
    slug: str = Field(..., example="new-blog-post")
    summary: str = Field(..., example="A short summary of the blog post.")
    content: str = Field(..., example="<p>Full content in HTML here.</p>")
