"""
Data models and validation schemas for the blog CMS.

Includes:
- BlogPost: Complete post model (used in DB and admin views)
- BlogPostIn: Input model for creation/updating
- BlogPostOut: Output model for safe public API exposure
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field
from typing_extensions import TypedDict


class Content(TypedDict):
    html: str

class BlogPost(BaseModel):
    """Full representation of a blog post, including internal metadata."""
    title: str = Field(..., example="Understanding FastAPI")
    slug: str = Field(..., example="understanding-fastapi")
    summary: str = Field(..., example="Intro to FastAPI with examples.")
    content: Content = Field(..., example={"html": "<p>This is the full article...</p>"})
    status: Literal["draft", "published"] = Field(default="draft")
    categories: list[str] = Field(default=[], example=["Python", "Backend"])
    date: datetime = Field(default_factory=datetime.utcnow)  # legacy/fallback
    date_created: datetime | None = None
    date_published: datetime | None = None
    date_updated: datetime | None = None
    featuredImage: str | None = Field(default="", example="https://example.com/image.jpg")
    featured: bool = Field(default=False)
    weight: int = Field(default=0)

class BlogPostIn(BaseModel):
    """Input schema for creating or updating blog posts (admin only)."""
    title: str
    slug: str
    summary: str
    content: Content
    status: Literal["draft", "published"] = "draft"
    categories: list[str] = Field(default=[])
    date: datetime | None = None  # legacy/fallback
    date_created: datetime | None = None
    date_published: datetime | None = None
    date_updated: datetime | None = None
    featuredImage: str | None = ""
    featured: bool = False
    weight: int = 0

class BlogPostOut(BaseModel):
    """Output schema for exposing safe post fields to public routes."""
    title: str
    slug: str
    summary: str
    content: Content
    date: datetime | None = None  # legacy/fallback
    date_created: datetime | None = None
    date_published: datetime | None = None
    date_updated: datetime | None = None
    status: Literal["draft", "published"] = "draft"
    categories: list[str] = Field(default=[])
    featuredImage: str | None = ""
    featured: bool = False
    weight: int = 0
