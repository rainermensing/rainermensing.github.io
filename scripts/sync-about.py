from html import escape
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
ABOUT = ROOT / "about.html"
START = "<!-- ABOUT-COPY:START -->"
END = "<!-- ABOUT-COPY:END -->"
SITE_URL = "https://rainermensing.github.io/"
LINK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def render_inline(text: str) -> str:
    rendered = []
    position = 0
    for match in LINK.finditer(text):
        rendered.append(escape(text[position:match.start()], quote=False))
        href = match.group(2)
        if href.startswith(SITE_URL):
            href = href[len(SITE_URL):]
        rendered.append(
            f'<a href="{escape(href)}">{escape(match.group(1), quote=False)}</a>'
        )
        position = match.end()
    rendered.append(escape(text[position:], quote=False))
    return "".join(rendered)


def render_about_copy(markdown: str) -> str:
    blocks = [
        " ".join(block.split())
        for block in re.split(r"\n\s*\n", markdown.strip())
    ]
    if not blocks or not blocks[0].startswith("# "):
        raise ValueError("README.md must start with an H1 About heading")

    paragraphs = [
        f'<p class="about-lede">{render_inline(blocks[0][2:])}</p>',
        *(f"<p>{render_inline(block)}</p>" for block in blocks[1:]),
    ]
    return "\n" + "\n".join(f"            {paragraph}" for paragraph in paragraphs) + "\n            "


def main() -> None:
    document = ABOUT.read_text(encoding="utf-8")
    if document.count(START) != 1 or document.count(END) != 1:
        raise ValueError("about.html must contain one ABOUT-COPY marker pair")

    start = document.index(START) + len(START)
    end = document.index(END)
    if start >= end:
        raise ValueError("ABOUT-COPY markers are out of order")

    updated = document[:start] + render_about_copy(README.read_text(encoding="utf-8")) + document[end:]
    if updated != document:
        ABOUT.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    main()