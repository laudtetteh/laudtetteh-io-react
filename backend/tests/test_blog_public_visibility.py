from datetime import UTC, datetime

from api.blog import set_posts_collection
from httpx import ASGITransport, AsyncClient
from main import app


def make_post(slug: str, status: str):
    return {
        "title": slug.replace("-", " ").title(),
        "slug": slug,
        "summary": "Summary",
        "content": {"html": "<p>Body</p>"},
        "status": status,
        "categories": ["Tech"],
        "date": datetime(2026, 8, 1, tzinfo=UTC),
        "date_created": datetime(2026, 8, 1, tzinfo=UTC),
        "date_published": (
            datetime(2026, 8, 1, tzinfo=UTC)
            if status == "published"
            else None
        ),
        "date_updated": datetime(2026, 8, 1, tzinfo=UTC),
        "featuredImage": "",
        "featured": False,
        "weight": 0,
    }


class FakeCursor:
    def __init__(self, posts):
        self.posts = posts

    def sort(self, _sort_spec):
        return self

    async def to_list(self, _limit):
        return self.posts


class FakePostsCollection:
    def __init__(self):
        self.posts = [
            make_post("published-post", "published"),
            make_post("draft-post", "draft"),
        ]

    def find(self, query=None):
        query = query or {}
        return FakeCursor([
            post for post in self.posts
            if all(post.get(key) == value for key, value in query.items())
        ])

    async def find_one(self, query):
        for post in self.posts:
            if all(post.get(key) == value for key, value in query.items()):
                return post
        return None


async def test_public_posts_list_excludes_drafts():
    set_posts_collection(FakePostsCollection())
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/posts")

    assert response.status_code == 200
    assert [post["slug"] for post in response.json()] == ["published-post"]


async def test_public_post_detail_404s_for_draft_slug():
    set_posts_collection(FakePostsCollection())
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/posts/draft-post")

    assert response.status_code == 404


async def test_public_blog_alias_404s_for_draft_slug():
    set_posts_collection(FakePostsCollection())
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/blog/draft-post")

    assert response.status_code == 404
