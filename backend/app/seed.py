import asyncio
from db import connect_to_mongo, get_db
from datetime import datetime

posts = [
    {
        "title": "Blog Post 1",
        "slug": "first-post",
        "summary": "This is a short summary of the first post.",
        "content": "<p>This is the full content of the first blog post. You can use HTML here.</p>",
        "date": datetime(2024, 1, 1),
    },
    {
        "title": "Blog Post 2",
        "slug": "second-post",
        "summary": "Another brief summary.",
        "content": "<p>This is the second post’s content. Lots of interesting insights go here.</p>",
        "date": datetime(2024, 2, 1),
    },
    {
        "title": "Blog Post 3",
        "slug": "third-post",
        "summary": "A summary of the third post.",
        "content": "<p>This is the content of blog post number three.</p>",
        "date": datetime(2024, 3, 1),
    }
]

async def seed():
    await connect_to_mongo()
    db = get_db()
    await db.posts.delete_many({})  # clear existing
    await db.posts.insert_many(posts)
    print("✅ Blog posts seeded.")

asyncio.run(seed())
