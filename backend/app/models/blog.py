"""
Data models and validation schemas for the blog CMS.

Includes:
- BlogPost: Complete post model (used in DB and admin views)
- BlogPostIn: Input model for creation/updating
- BlogPostOut: Output model for safe public API exposure
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class BlogPost(BaseModel):
    """Full representation of a blog post, including internal metadata."""
    title: str = Field(..., example="Understanding FastAPI")
    slug: str = Field(..., example="understanding-fastapi")
    summary: str = Field(..., example="Intro to FastAPI with examples.")
    content: dict[str, str] = Field(..., example={"html": "<p>This is the full article...</p>"})
    status: Literal["draft", "published"] = Field(default="draft")
    categories: List[str] = Field(default=[], example=["Python", "Backend"])
    date: datetime = Field(default_factory=datetime.utcnow)
    featuredImage: Optional[str] = Field(default="", example="https://example.com/image.jpg")
    featured: bool = Field(default=False)
    weight: int = Field(default=0)

class BlogPostIn(BaseModel):
    """Input schema for creating or updating blog posts (admin only)."""
    title: str
    slug: str
    summary: str
    content: dict[str, str]
    status: Literal["draft", "published"] = "draft"
    categories: List[str] = Field(default=[])
    featuredImage: Optional[str] = ""
    featured: bool = False
    weight: int = 0

class BlogPostOut(BaseModel):
    """Output schema for exposing safe post fields to public routes."""
    title: str
    slug: str
    summary: str
    content: dict[str, str]
    date: datetime
    status: Literal["draft", "published"] = "draft"
    categories: List[str] = Field(default=[])
    featuredImage: Optional[str] = ""
    featured: bool = False
    weight: int = 0
