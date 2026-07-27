"""
Script to seed blog posts and categories into MongoDB.

Usage:
$ python backend/app/seed.py

Note:
Ensure your `.env` contains MONGO_URI and MONGO_DB_NAME.
"""

import argparse
import asyncio
import json
from datetime import datetime
from pathlib import Path

import core.db
from dateutil.parser import parse as parse_date

# Sample blog posts
posts = [
    {
        "title": "Blog Post 1",
        "slug": "first-post",
        "summary": "This is a short summary of the first post.",
        "content": {
            "html": "<p>This is the full content of the first blog post. You can use HTML here.</p>"
        },
        "date": datetime(2024, 1, 1),
        "status": "published",
        "categories": ["Tech:FastAPI", "Tech:Backend"],
        "featuredImage": "https://via.placeholder.com/800x400.png?text=First+Post",
        "featured": False,
        "weight": 0,
    },
    {
        "title": "Blog Post 2",
        "slug": "second-post",
        "summary": "Another brief summary.",
        "content": {
            "html": (
                "<p>This is the second post's content. "
                "Lots of interesting insights go here.</p>"
            )
        },
        "date": datetime(2024, 2, 1),
        "status": "draft",
        "categories": ["Infra:DevOps", "Infra:MongoDB"],
        "featuredImage": "https://via.placeholder.com/800x400.png?text=Second+Post",
        "featured": False,
        "weight": 0,
    },
    {
        "title": "Blog Post 3",
        "slug": "third-post",
        "summary": "A summary of the third post.",
        "content": {"html": "<p>This is the content of blog post number three.</p>"},
        "date": datetime(2024, 3, 1),
        "status": "published",
        "categories": ["Frontend:React", "Frontend:CMS"],
        "featuredImage": "https://via.placeholder.com/800x400.png?text=Third+Post",
        "featured": False,
        "weight": 0,
    }
]

# Grouped categories
categories = [
    {
        "name": "My Journey", "slug": "my-journey",
        "group": "My Journey", "createdAt": datetime.utcnow(),
    },
    {
        "name": "Tech & Projects", "slug": "tech-projects",
        "group": "Tech & Projects", "createdAt": datetime.utcnow(),
    },
    {
        "name": "Career & Mindset", "slug": "career-mindset",
        "group": "Career & Mindset", "createdAt": datetime.utcnow(),
    },
    {
        "name": "Life & Balance", "slug": "life-balance",
        "group": "Life & Balance", "createdAt": datetime.utcnow(),
    },
]

POSTS_FILE = Path(__file__).parent / "out" / "posts.json"

async def seed(mode: str):
    await core.db.connect_to_mongo()

    if mode == 'replace':
        print("🔄 Clearing existing data (replace mode)...")
        await core.db.db.categories.delete_many({})
        await core.db.db.posts.delete_many({})

        print("🌱 Inserting categories...")
        await core.db.db.categories.insert_many(categories)

        # Load posts from posts.json if it exists
        if POSTS_FILE.exists():
            print("📝 Inserting blog posts from posts.json...")
            with open(POSTS_FILE, encoding="utf-8") as f:
                posts = json.load(f)
            await core.db.db.posts.insert_many(posts)
        else:
            print("⚠️ posts.json not found. No blog posts inserted.")
    else:
        print("🔄 Upserting posts and categories (update mode)...")
        # Upsert categories
        for cat in categories:
            await core.db.db.categories.update_one(
                {"slug": cat["slug"]}, {"$set": cat}, upsert=True
            )
        # Upsert posts
        if POSTS_FILE.exists():
            print("📝 Upserting blog posts from posts.json...")
            with open(POSTS_FILE, encoding="utf-8") as f:
                posts = json.load(f)
            for post in posts:
                # Fallback logic: if only 'date' is present, use it for the others
                date_val = post.get("date")
                if not post.get("date_created"):
                    post["date_created"] = date_val or datetime.utcnow().isoformat()
                if not post.get("date_published"):
                    post["date_published"] = date_val or datetime.utcnow().isoformat()
                if "date_updated" not in post:
                    post["date_updated"] = None
                # Always include 'date' as legacy/fallback
                if not date_val:
                    post["date"] = (
                        post["date_published"]
                        or post["date_created"]
                        or datetime.utcnow().isoformat()
                    )
                # Parse all date fields to datetime
                for field in ["date", "date_created", "date_published", "date_updated"]:
                    val = post.get(field)
                    if val and isinstance(val, str):
                        try:
                            post[field] = parse_date(val)
                        except Exception:
                            pass
                await core.db.db.posts.update_one(
                    {"slug": post["slug"]}, {"$set": post}, upsert=True
                )
        else:
            print("⚠️ posts.json not found. No blog posts upserted.")

    print("✅ Blog posts and categories seeded successfully.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        '--update', action='store_true',
        help='Update existing posts or insert new ones (default)',
    )
    group.add_argument(
        '--replace', action='store_true',
        help='Delete all posts and replace with seed data',
    )
    args = parser.parse_args()
    mode = 'replace' if args.replace else 'update'
    asyncio.run(seed(mode))
