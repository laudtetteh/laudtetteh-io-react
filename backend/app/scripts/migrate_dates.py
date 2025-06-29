#!/usr/bin/env python3
"""
Migration script to add new date fields to existing blog posts.
This script will:
1. Find all posts with the old 'date' field
2. Set date_created = date (when post was created)
3. Set date_published = date (assuming existing posts are published)
4. Set date_updated = None (will be set on next update)
5. Keep the old 'date' field for backward compatibility
"""

import asyncio
import motor.motor_asyncio
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def migrate_dates():
    """Add new date fields to existing blog posts."""
    
    # Connect to MongoDB using the same logic as main app
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db_name = os.getenv("MONGO_DB_NAME", "laud_blog")
    
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    db = client[mongo_db_name]
    posts_collection = db.posts
    
    print("🔍 Starting date migration...")
    
    # Find all posts
    cursor = posts_collection.find({})
    posts_to_migrate = []
    async for post in cursor:
        posts_to_migrate.append(post)

    print(f"\U0001F4CA Found {len(posts_to_migrate)} posts to check for date normalization")

    if not posts_to_migrate:
        print("\u2705 No posts found.")
        return

    migrated_count = 0
    for post in posts_to_migrate:
        try:
            update_data = {}
            for field in ["date", "date_created", "date_published", "date_updated"]:
                val = post.get(field)
                if val and isinstance(val, str):
                    try:
                        # Try parsing ISO format, fallback to dateutil if needed
                        try:
                            dt = datetime.fromisoformat(val.replace('Z', '+00:00'))
                        except Exception:
                            from dateutil.parser import parse
                            dt = parse(val)
                        update_data[field] = dt
                    except Exception as e:
                        print(f"\u26A0\uFE0F  Post {post.get('_id')} has invalid {field} format: {val} ({e})")
            if update_data:
                result = await posts_collection.update_one(
                    {"_id": post["_id"]},
                    {"$set": update_data}
                )
                if result.modified_count > 0:
                    migrated_count += 1
                    print(f"\u2705 Normalized dates for post: {post.get('title', 'Unknown')} (ID: {post['_id']})")
        except Exception as e:
            print(f"\u274C Error normalizing post {post.get('_id')}: {str(e)}")

    print(f"\n\U0001F389 Date normalization complete!")
    print(f"\U0001F4C8 Successfully normalized {migrated_count} out of {len(posts_to_migrate)} posts")
    
    # Verify migration
    remaining_old_posts = await posts_collection.count_documents({
        "date": {"$exists": True},
        "$or": [
            {"date_created": {"$exists": False}},
            {"date_published": {"$exists": False}},
            {"date_updated": {"$exists": False}}
        ]
    })
    
    print(f"🔍 Verification:")
    print(f"   - Posts still needing migration: {remaining_old_posts}")
    
    if remaining_old_posts == 0:
        print("✅ All posts successfully migrated!")
    else:
        print(f"⚠️  {remaining_old_posts} posts still need migration")

if __name__ == "__main__":
    asyncio.run(migrate_dates()) 