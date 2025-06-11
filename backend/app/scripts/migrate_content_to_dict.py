#!/usr/bin/env python3
"""
Migration script: Convert all blog posts with string 'content' fields to dicts with an 'html' key.
Run this inside your backend container or anywhere with access to your MongoDB.
"""
from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "laud_blog")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]
posts = db["posts"]

count = 0
for post in posts.find():
    content = post.get("content")
    if isinstance(content, str):
        posts.update_one({"_id": post["_id"]}, {"$set": {"content": {"html": content}}})
        count += 1

print(f"Migration complete. Updated {count} posts.")
