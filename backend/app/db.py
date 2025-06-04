"""
Database connection using Motor (async MongoDB client).

This module:
- Connects to MongoDB using MONGO_URI and MONGO_DB_NAME
- Provides `connect_to_mongo()` for explicit connection setup
- Provides `get_db()` to retrieve the db instance
- Allows scripts like `seed.py` to use the same connection logic

Note: For FastAPI routes, `posts_collection = db["posts"]` is done separately after `connect_to_mongo()` is called.
"""

from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "laud_blog")

client = None
db = None

async def connect_to_mongo():
    """Establish connection to MongoDB and set global db reference."""
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[MONGO_DB_NAME]

def get_db():
    """Returns the connected database instance."""
    return db
