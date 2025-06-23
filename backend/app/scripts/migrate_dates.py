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
    
    # Find all posts that have the old 'date' field but not the new ones
    cursor = posts_collection.find({
        "date": {"$exists": True},
        "$or": [
            {"date_created": {"$exists": False}},
            {"date_published": {"$exists": False}},
            {"date_updated": {"$exists": False}}
        ]
    })
    
    posts_to_migrate = []
    async for post in cursor:
        posts_to_migrate.append(post)
    
    print(f"📊 Found {len(posts_to_migrate)} posts to migrate")
    
    if not posts_to_migrate:
        print("✅ No posts need migration. All posts already have the new date fields.")
        return
    
    # Migrate each post
    migrated_count = 0
    for post in posts_to_migrate:
        try:
            old_date = post.get("date")
            if not old_date:
                print(f"⚠️  Post {post.get('_id')} has empty date field, skipping...")
                continue
            
            # Convert string date to datetime if needed
            if isinstance(old_date, str):
                try:
                    old_date = datetime.fromisoformat(old_date.replace('Z', '+00:00'))
                except ValueError:
                    print(f"⚠️  Post {post.get('_id')} has invalid date format: {old_date}")
                    continue
            
            # Prepare update - only add missing fields
            update_data = {}
            if "date_created" not in post:
                update_data["date_created"] = old_date
            if "date_published" not in post:
                update_data["date_published"] = old_date  # Assume existing posts are published
            if "date_updated" not in post:
                update_data["date_updated"] = None
            
            if update_data:
                # Update the post
                result = await posts_collection.update_one(
                    {"_id": post["_id"]},
                    {"$set": update_data}
                )
                
                if result.modified_count > 0:
                    migrated_count += 1
                    print(f"✅ Migrated post: {post.get('title', 'Unknown')} (ID: {post['_id']})")
                else:
                    print(f"❌ Failed to migrate post: {post.get('title', 'Unknown')} (ID: {post['_id']})")
                    
        except Exception as e:
            print(f"❌ Error migrating post {post.get('_id')}: {str(e)}")
    
    print(f"\n🎉 Migration complete!")
    print(f"📈 Successfully migrated {migrated_count} out of {len(posts_to_migrate)} posts")
    
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