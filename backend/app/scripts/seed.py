"""
Script to seed blog posts and categories into MongoDB.

Usage:
$ python backend/app/seed.py

Note:
Ensure your `.env` contains MONGO_URI and MONGO_DB_NAME.
"""

import asyncio
from datetime import datetime
from core.db import connect_to_mongo, get_db

# Sample blog posts
posts = [
    {
        "title": "Blog Post 1",
        "slug": "first-post",
        "summary": "This is a short summary of the first post.",
        "content": {"html": "<p>This is the full content of the first blog post. You can use HTML here.</p>"},
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
        "content": {"html": "<p>This is the second post's content. Lots of interesting insights go here.</p>"},
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
    {"name": "My Journey", "slug": "my-journey", "group": "My Journey", "createdAt": datetime.utcnow()},
    {"name": "Tech & Projects", "slug": "tech-projects", "group": "Tech & Projects", "createdAt": datetime.utcnow()},
    {"name": "Career & Mindset", "slug": "career-mindset", "group": "Career & Mindset", "createdAt": datetime.utcnow()},
    {"name": "Life & Balance", "slug": "life-balance", "group": "Life & Balance", "createdAt": datetime.utcnow()},
]

async def seed():
    await connect_to_mongo()
    db = get_db()

    print("🔄 Clearing existing data...")
    await db.posts.delete_many({})
    await db.categories.delete_many({})

    print("🌱 Inserting categories...")
    await db.categories.insert_many(categories)

    print("📝 Inserting blog posts...")
    await db.posts.insert_many(posts)

    print("✅ Blog posts and categories seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed())
