"""
Blog API routes for:
- GET all posts
- GET post by slug
- POST create
- PUT update
- DELETE remove
- GET categories with groups

Backed by MongoDB via Motor.
"""

from datetime import datetime

import pytz
from core.auth import verify_token
from dateutil.parser import parse as parse_date
from fastapi import APIRouter, Depends, HTTPException
from models.blog import BlogPost, BlogPostIn
from models.category import Category
from pydantic import BaseModel
from utils.sanitize import sanitize_html

router = APIRouter()

# Connect to DB collections
posts_collection = None
categories_collection = None

PT = pytz.timezone('America/Los_Angeles')

def set_posts_collection(collection):
    global posts_collection
    posts_collection = collection

def set_categories_collection(collection):
    global categories_collection
    categories_collection = collection

def coerce_dates(post_dict):
    for field in ["date", "date_created", "date_published", "date_updated"]:
        val = post_dict.get(field)
        if val and isinstance(val, str):
            try:
                post_dict[field] = parse_date(val)
            except Exception:
                pass
    return post_dict

@router.get("/api/posts", response_model=list[BlogPost])
async def get_all_posts():
    # Sort by date_published (desc), falling back to date_created for older posts
    posts = await posts_collection.find({"status": "published"}).sort([
        ("date_published", -1),
        ("date_created", -1),
        ("date", -1)
    ]).to_list(100)
    return posts

@router.get("/api/posts/{slug}", response_model=BlogPost)
async def get_post_by_slug(slug: str):
    post = await posts_collection.find_one({"slug": slug, "status": "published"})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/api/posts", response_model=BlogPost, dependencies=[Depends(verify_token)])
async def create_post(post_in: BlogPostIn):
    existing = await posts_collection.find_one({"slug": post_in.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    post = post_in.dict(exclude_unset=True)
    post = coerce_dates(post)
    now = datetime.now(pytz.utc)
    post["date_created"] = now
    post["date_updated"] = now

    if post_in.date_published:
        # Date is already a datetime object from Pydantic
        post["date_published"] = post_in.date_published.astimezone(pytz.utc)
    elif post.get("status") == "published":
        # If no date is provided and status is published, use current time
        post["date_published"] = now

    post["content"]["html"] = sanitize_html(post["content"]["html"])
    
    await posts_collection.insert_one(post)
    return post

@router.put("/api/posts/{slug}", response_model=BlogPost, dependencies=[Depends(verify_token)])
async def update_post(slug: str, updated: BlogPostIn):
    # Get the existing post to check status changes
    existing_post = await posts_collection.find_one({"slug": slug})
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    updated_post = updated.dict(exclude_unset=True)
    updated_post = coerce_dates(updated_post)
    now = datetime.now(pytz.utc)
    updated_post["date_updated"] = now
    updated_post["content"]["html"] = sanitize_html(updated_post["content"]["html"])
    
    # Handle date_published when status changes to published
    new_status = updated_post.get("status")
    old_status = existing_post.get("status")
    
    if new_status == "published":
        if updated.date_published:
            # Date is already a datetime object from Pydantic
            updated_post["date_published"] = updated.date_published.astimezone(pytz.utc)
        elif not existing_post.get("date_published"):
            # If publishing for the first time without a specific date, use current time
            updated_post["date_published"] = now
    elif new_status == "draft" and old_status == "published":
        # Post is being unpublished, remove date_published
        updated_post["date_published"] = None
    
    result = await posts_collection.find_one_and_update(
        {"slug": slug},
        {"$set": updated_post},
        return_document=True
    )
    return result

@router.delete("/api/posts/{slug}", dependencies=[Depends(verify_token)])
async def delete_post(slug: str):
    result = await posts_collection.delete_one({"slug": slug})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted"}

@router.get("/api/admin/posts", response_model=list[BlogPost], dependencies=[Depends(verify_token)])
async def get_all_posts_admin():
    # Sort by date_published (desc), falling back to date_created for older posts
    posts = await posts_collection.find().sort([
        ("date_published", -1),
        ("date_created", -1),
        ("date", -1)
    ]).to_list(100)
    return posts

@router.get(
    "/api/admin/posts/{slug}",
    response_model=BlogPost,
    dependencies=[Depends(verify_token)],
)
async def get_post_by_slug_admin(slug: str):
    post = await posts_collection.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.get("/api/blog/{slug}", response_model=BlogPost)
async def get_public_post(slug: str):
    post = await posts_collection.find_one({"slug": slug, "status": "published"})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.get("/api/blog", response_model=list[BlogPost])
async def blog_alias():
    return await get_all_posts()

class WeightUpdate(BaseModel):
    slug: str
    weight: int

@router.post("/api/admin/update-weights", dependencies=[Depends(verify_token)])
async def update_post_weights(weights: list[WeightUpdate]):
    for item in weights:
        await posts_collection.update_one(
            {"slug": item.slug},
            {"$set": {"weight": item.weight}}
        )
    return {"message": "Weights updated"}

# 🆕 NEW ENDPOINT: GET grouped categories
@router.get("/api/categories", response_model=dict[str, list[Category]])
async def get_grouped_categories():
    all_cats = await categories_collection.find().sort("name", 1).to_list(100)
    grouped = {}
    for cat in all_cats:
        group = cat.get("group", "Other")
        grouped.setdefault(group, []).append(cat)
    return grouped
