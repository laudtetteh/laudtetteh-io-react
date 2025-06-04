"""
Blog API routes for:
- GET all posts
- GET post by slug
- POST create
- PUT update
- DELETE remove

Backed by MongoDB via Motor.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from models import BlogPost, BlogPostIn
from db import connect_to_mongo, get_db

router = APIRouter()

# Connect to DB and access collection
posts_collection = None

@router.on_event("startup")
async def init_db():
    """Initialize DB connection when router starts."""
    global posts_collection
    await connect_to_mongo()
    db = get_db()
    posts_collection = db["posts"]

@router.get("/api/posts", response_model=List[BlogPost])
async def get_all_posts():
    """List all blog posts, sorted by date (newest first)."""
    posts = await posts_collection.find().sort("date", -1).to_list(100)
    return posts

@router.get("/api/posts/{slug}", response_model=BlogPost)
async def get_post_by_slug(slug: str):
    """Get a single post by its slug."""
    post = await posts_collection.find_one({ "slug": slug })
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/api/posts", response_model=BlogPost)
async def create_post(post_in: BlogPostIn):
    """Create a new blog post. Slugs must be unique."""
    existing = await posts_collection.find_one({ "slug": post_in.slug })
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    post = post_in.dict()
    post["date"] = datetime.utcnow()

    await posts_collection.insert_one(post)
    return post

@router.put("/api/posts/{slug}", response_model=BlogPost)
async def update_post(slug: str, updated: BlogPostIn):
    """Update an existing blog post."""
    updated_post = updated.dict()
    updated_post["date"] = datetime.utcnow()

    result = await posts_collection.find_one_and_update(
        { "slug": slug },
        { "$set": updated_post },
        return_document=True
    )

    if not result:
        raise HTTPException(status_code=404, detail="Post not found")

    return result

@router.delete("/api/posts/{slug}")
async def delete_post(slug: str):
    """Delete a blog post by its slug."""
    result = await posts_collection.delete_one({ "slug": slug })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return { "message": "Post deleted" }
