"""
Export all (or filtered) posts from MongoDB to a JSON file matching posts.json format.

Usage:
$ python -m scripts.export_posts [--output FILENAME] [--filter key=value ...]

Examples:
$ python -m scripts.export_posts --output published.json --filter status=published
$ python -m scripts.export_posts --filter categories=Tech\ \&\ Projects
"""
import argparse
import asyncio
import json
import shutil
from datetime import datetime
from pathlib import Path

import core.db


async def export_posts(filters: dict):
    await core.db.connect_to_mongo()
    print(f"🔄 Fetching posts from database with filters: {filters if filters else 'none'}...")
    query = {}
    filter_part = []
    for k, v in filters.items():
        if k == 'categories':
            categories = [c.strip() for c in v.split(',')]
            query[k] = {"$in": categories}
            filter_part.append(f"categories_{'_'.join(categories)}")
        else:
            query[k] = v
            filter_part.append(f"{k}_{v}")
    posts = await core.db.db.posts.find(query).to_list(length=None)
    formatted_posts = []
    for post in posts:
        post.pop('_id', None)
        # Fallback logic for dates
        date_val = post.get("date") or post.get("date_published") or post.get("date_created") or ""
        date_created = post.get("date_created") or post.get("date") or ""
        date_published = post.get("date_published") or post.get("date") or ""
        date_updated = post.get("date_updated") if "date_updated" in post else None
        formatted = {
            "title": post.get("title", ""),
            "slug": post.get("slug", ""),
            "summary": post.get("summary", ""),
            "content": {
                "html": post.get("content", {}).get("html", "")
            },
            "status": post.get("status", ""),
            "categories": post.get("categories", []),
            "date": date_val,
            "date_created": date_created,
            "date_published": date_published,
            "date_updated": date_updated,
            "featuredImage": post.get("featuredImage", ""),
            "featured": post.get("featured", False),
            "weight": post.get("weight", 1)
        }
        formatted_posts.append(formatted)
    # Ensure output directory exists
    out_dir = Path(__file__).parent / 'in'
    out_dir.mkdir(parents=True, exist_ok=True)
    # Build filename
    date_str = datetime.now().strftime('%Y%m%d')
    if filter_part:
        filename = f"{'_'.join(filter_part)}_{date_str}.json"
    else:
        filename = f"all_{date_str}.json"
    out_path = out_dir / filename
    # Backup if file exists
    if out_path.exists():
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = out_path.parent / f"{out_path.stem}_{timestamp}.bak.json"
        shutil.copy(out_path, backup_path)
        print(f"🗂️  Existing {filename} backed up as {backup_path.name}")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(formatted_posts, f, ensure_ascii=True, indent=2, default=str)
    print(f"✅ Exported {len(formatted_posts)} posts to {out_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--filter', '-f', action='append', help='Filter in key=value format (can be used multiple times)')
    args = parser.parse_args()
    filters = {}
    if args.filter:
        for f in args.filter:
            if '=' in f:
                k, v = f.split('=', 1)
                filters[k] = v
    asyncio.run(export_posts(filters)) 