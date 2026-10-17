"""Assemble the Task 1-7 outputs into one submission document.

The .md files in outputs/ stay the source of truth; this script copies them
into submission.md in the order of the brief, rewrites relative links to
GitHub URLs (so they work in the Google Doc and PDF) and runs the checks
listed in the R8 definition of done.

    pip install markdown
    python build_submission.py          # writes submission.md + .html, prints checks

submission.html is the file to upload to Google Drive ("Open with Google
Docs") and to print as the PDF.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REPO = "https://github.com/bhawnamanglapm/Franchise-in-a-Box-OS/blob/main/"


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def fix_links(text, rel):
    """Turn relative markdown links into absolute GitHub links."""
    base = (ROOT / rel).parent

    def repl(m):
        label, target = m.group(1), m.group(2)
        if re.match(r"^(https?:|mailto:|#)", target):
            return m.group(0)
        path, _, anchor = target.partition("#")
        resolved = (base / path).resolve().relative_to(ROOT).as_posix()
        return f"[{label}]({REPO}{resolved}{'#' + anchor if anchor else ''})"

    return re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", repl, text)


def sections(text, drop):
    """Drop '## ' sections whose heading starts with any string in drop."""
    out, keep = [], True
    for line in text.splitlines():
        if line.startswith("## "):
            keep = not any(line[3:].startswith(d) for d in drop)
        if keep:
            out.append(line)
    return "\n".join(out)


def demote(text):
    """One heading level down, so each task's own H1 becomes an H2."""
    return re.sub(r"^(#{1,5}) ", r"#\1 ", text, flags=re.M)


def tldr(rel):
    lines = read(rel).splitlines()
    start = next(i for i, l in enumerate(lines) if l.startswith("> **TL;DR"))
    block = []
    for l in lines[start:]:
        if not l.startswith(">"):
            break
        block.append(l)
    return fix_links("\n".join(block), rel)


def part(rel, drop=()):
    return demote(fix_links(sections(read(rel), drop), rel))


def task1():
    r1 = "outputs/R1-product-thinking/"
    readme = read(r1 + "README.md")
    numbers = readme.split("## Key numbers", 1)[1].split("\n## ", 1)[0]
    return "\n\n".join([
        "## Task 1. Product thinking",
        "Task 1 is a 25-page document on its own. The three answers and the "
        "headline numbers are below; the full text is in the "
        f"[Task 1 Google Doc](https://docs.google.com/document/d/1oVwbVyPmijSpRmR4Wj66hQFQLzTLCQghKYBQDkpeFJQ/edit) "
        f"and the [Task 1 PDF]({REPO}{r1}Task-1-Product-Thinking.pdf).",
        "### 1a. What ships in the first 30 days", tldr(r1 + "1a-prioritisation.md"),
        "### 1b. AI vs human split: is 76% real?", tldr(r1 + "1b-ai-human-split.md"),
        "**Key numbers**" + numbers.rstrip(),
        "### 1c. Developer-ready spec: Conversation Takeover", tldr(r1 + "1c-takeover-spec.md"),
        f"Full spec: [1c-takeover-spec.md]({REPO}{r1}1c-takeover-spec.md). "
        "It covers UI behaviour, 7 conversation states and 9 transitions, 10 edge cases "
        "with error handling, and 11 pass/fail acceptance tests.",
    ])


def task5():
    text = sections(read("outputs/R5-financial-model/README.md"),
                    ("Rebuild", "Definition of done"))
    text = text.replace("# Task 5: FreshBrew Financial Model", "# Task 5. FreshBrew financial model", 1)
    return demote(fix_links(text, "outputs/R5-financial-model/README.md"))


def task6():
    r6 = "outputs/R6-automation-research/"
    return "\n\n".join([
        "## Task 6. Automation and market research",
        demote(part(r6 + "task6a-lead-flow.md")),
        demote(part(r6 + "task6b-ev-servicing.md")),
    ])


COMPLETENESS = """## Completeness check against the brief

| Brief item | Where |
|---|---|
| 1a prioritisation · 1b AI vs human split, 76% verdict, investor fix · 1c spec (UI, states, errors, success criteria) | Task 1 |
| 2 one prototype (Option B): live URL · exact prompts · what AI got wrong · manual fixes · one more day | Task 2 |
| 3A ≥ 6 triggers (8) · 3B 150–250-word prompt (238) · 3C default model + validation test | Task 3 |
| 4 top 4 with reasons · Month 2 · can be cut · QSR variation | Task 4 |
| 5 monthly P&L Y1 · payback · Scale100x 3-year revenue · ₹6L/8L/10L sensitivity · assumptions tab | Task 5 (Google Sheet) |
| 6A tools · steps · human checkpoints · time saved · one risk | Task 6A |
| 6B market size + growth (sourced) · competitors · geography · key risk · recommendation | Task 6B |
| 7 tools · self-rating · process · complex problem · ambiguity | Task 7 |
"""


def build():
    r2b = "outputs/R2B-whatsapp-agent-panel/README.md"
    t2 = part(r2b, drop=("Screenshots", "Files in this folder"))
    t2 = t2.replace("## Task 2, Option B:", "## Task 2. Prototype, Option B:", 1)
    doc = "\n\n".join([
        "# Scale100x AI Product Manager assignment",
        "Bhawna Mangla · Franchise-in-a-Box OS",
        read("outputs/R8-submission/executive-summary.md").strip(),
        task1(),
        t2,
        part("outputs/R3-ai-agent-design/task3-ai-agent-design.md"),
        part("outputs/R4-prioritisation/task4-prioritisation.md"),
        task5(),
        task6(),
        part("outputs/R7-how-you-work/task7-how-you-work.md").replace("## Task 7: How I work", "## Task 7. How I work", 1),
        COMPLETENESS,
    ])
    return re.sub(r"\n{3,}", "\n\n", doc).strip() + "\n"


CSS = """
body { font-family: Inter, Arial, sans-serif; font-size: 10.5pt; line-height: 1.45;
       color: #111; background: #fff; max-width: 820px; margin: 0 auto; padding: 16px; }
h1 { font-size: 20pt; } h2 { font-size: 15pt; border-bottom: 1px solid #ccc;
     padding-bottom: 4px; margin-top: 28px; page-break-before: always; }
h3 { font-size: 12.5pt; margin-top: 20px; } h4 { font-size: 11pt; }
table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9pt; }
th, td { border: 1px solid #bbb; padding: 4px 6px; vertical-align: top; text-align: left; }
th { background: #f0f0f0; }
blockquote { border-left: 4px solid #2563EB; margin: 8px 0; padding: 4px 12px; background: #f5f8ff; }
pre { white-space: pre-wrap; background: #f6f6f6; padding: 8px; font-size: 9pt; }
code { font-family: Consolas, monospace; font-size: 9pt; }
a { color: #2563EB; }
h2:first-of-type { page-break-before: avoid; }
"""


def to_html(doc):
    import markdown
    # Bare URLs are not links in markdown; wrap them so they are clickable.
    doc = re.sub(r"(?<![(<\[`/])(https?://[^\s|)>\]`*]+)", lambda m: f"<{m.group(1)}>", doc)
    body = markdown.markdown(doc, extensions=["tables", "fenced_code", "sane_lists"])
    return ("<!doctype html><html><head><meta charset='utf-8'>"
            "<title>Scale100x AI PM assignment</title>"
            f"<style>{CSS}</style></head><body>{body}</body></html>")


def checks(doc):
    results = []
    prompt = re.search(r"```text\n(.*?)```", doc, flags=re.S).group(1)
    words = len(prompt.split())
    results.append((150 <= words <= 250, f"System prompt is {words} words (brief: 150-250)"))
    for n in range(1, 8):
        results.append((f"## Task {n}." in doc, f"Task {n} section present"))
    for url in ("fiab-r2b-whatsapp-agent-panel.vercel.app", "1hvPhC2OA14JhPUtjZFc1rd907xJMpPJtFsQDe7I6YeA"):
        results.append((url in doc, f"Link present: {url}"))
    rel = re.findall(r"\]\((?!https?:|mailto:|#)[^)]+\)", doc)
    results.append((not rel, f"Relative links left: {len(rel)}"))
    stale = [s for s in ("₹40L", "₹40 lakh") if s in doc]
    results.append((not stale, f"Old FreshBrew investment figure: {stale or 'none'}"))
    holes = doc.count("**[")
    results.append((True, f"Owner placeholders still to fill: {holes}"))
    return results


if __name__ == "__main__":
    doc = build()
    (HERE / "submission.md").write_text(doc, encoding="utf-8")
    (HERE / "submission.html").write_text(to_html(doc), encoding="utf-8")
    ok = True
    for passed, msg in checks(doc):
        ok &= passed
        print(("PASS " if passed else "FAIL ") + msg)
    print(f"{len(doc.split())} words written to submission.md")
    sys.exit(0 if ok else 1)
