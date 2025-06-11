import bleach

# Allowed HTML tags and attributes for blog content
ALLOWED_TAGS = set(bleach.sanitizer.ALLOWED_TAGS).union(
    {
        "p",
        "img",
        "h1",
        "h2",
        "h3",
        "pre",
        "code",
        "ul",
        "ol",
        "li",
        "strong",
        "em",
        "blockquote",
        "a",
        "br",
    }
)
ALLOWED_ATTRIBUTES = {
    "*": ["class", "id"],
    "a": ["href", "title"],
    "img": ["src", "alt", "title", "width", "height", "loading"],
}


def sanitize_html(content: str | dict[str, str]) -> dict[str, str]:
    if isinstance(content, dict) and "html" in content:
        html = content["html"]
    else:
        html = str(content)

    sanitized = bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=["http", "https", "mailto"],
        strip=True,
    )
    return {"html": sanitized}
