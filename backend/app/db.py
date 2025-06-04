"""
Database connection using Motor (async MongoDB client).

Exposes:
- `connect_to_mongo()` to initialize DB connection
- `get_db()` to retrieve the db instance
- `posts_collection` to interact with the "posts" collection
"""

from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "laudtetteh_io_db")

client = None
db = None

async def connect_to_mongo():
    """Initialize MongoDB client and assign db reference."""
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[MONGO_DB_NAME]

def get_db():
    """Return the database reference after connection is established."""
    return db
