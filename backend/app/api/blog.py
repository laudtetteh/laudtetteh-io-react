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

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from datetime import datetime
from models.blog import BlogPost, BlogPostIn
from models.category import Category
from core.auth import verify_token
from pydantic import BaseModel
from utils.sanitize import sanitize_html

router = APIRouter()

# Connect to DB collections
posts_collection = None
categories_collection = None

def set_posts_collection(collection):
    global posts_collection
    posts_collection = collection

def set_categories_collection(collection):
    global categories_collection
    categories_collection = collection

@router.get("/api/posts", response_model=List[BlogPost])
async def get_all_posts():
    posts = await posts_collection.find().sort("date", -1).to_list(100)
    return posts

@router.get("/api/posts/{slug}", response_model=BlogPost)
async def get_post_by_slug(slug: str):
    post = await posts_collection.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/api/posts", response_model=BlogPost, dependencies=[Depends(verify_token)])
async def create_post(post_in: BlogPostIn):
    existing = await posts_collection.find_one({"slug": post_in.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    post = post_in.dict()
    post["content"] = sanitize_html(post["content"])
    post["date"] = datetime.utcnow()
    await posts_collection.insert_one(post)
    return post

@router.put("/api/posts/{slug}", response_model=BlogPost, dependencies=[Depends(verify_token)])
async def update_post(slug: str, updated: BlogPostIn):
    updated_post = updated.dict()
    updated_post["date"] = datetime.utcnow()
    updated_post["content"] = sanitize_html(updated_post["content"])
    result = await posts_collection.find_one_and_update(
        {"slug": slug},
        {"$set": updated_post},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Post not found")
    return result

@router.delete("/api/posts/{slug}", dependencies=[Depends(verify_token)])
async def delete_post(slug: str):
    result = await posts_collection.delete_one({"slug": slug})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted"}

@router.get("/api/admin/posts", response_model=List[BlogPost], dependencies=[Depends(verify_token)])
async def get_all_posts_admin():
    posts = await posts_collection.find().sort("date", -1).to_list(100)
    return posts

@router.get("/api/blog/{slug}", response_model=BlogPost)
async def get_public_post(slug: str):
    post = await posts_collection.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.get("/api/blog", response_model=List[BlogPost])
async def blog_alias():
    return await get_all_posts()

class WeightUpdate(BaseModel):
    slug: str
    weight: int

@router.post("/api/admin/update-weights", dependencies=[Depends(verify_token)])
async def update_post_weights(weights: List[WeightUpdate]):
    for item in weights:
        await posts_collection.update_one(
            {"slug": item.slug},
            {"$set": {"weight": item.weight}}
        )
    return {"message": "Weights updated"}

# 🆕 NEW ENDPOINT: GET grouped categories
@router.get("/api/categories", response_model=Dict[str, List[Category]])
async def get_grouped_categories():
    all_cats = await categories_collection.find().sort("name", 1).to_list(100)
    grouped = {}
    for cat in all_cats:
        group = cat.get("group", "Other")
        grouped.setdefault(group, []).append(cat)
    return grouped
