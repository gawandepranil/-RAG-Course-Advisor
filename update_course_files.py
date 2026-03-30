from pathlib import Path

COURSES_DIR = Path("data/courses")


def parse_file(text: str):
    lines = text.splitlines()

    metadata = {}
    content_start = 0

    for i, line in enumerate(lines):
        if ":" in line:
            key, value = line.split(":", 1)
            key = key.strip().lower()
            value = value.strip()

            if key in {"filename", "source_url", "course_code", "document_type"}:
                metadata[key] = value
                content_start = i + 1
            else:
                break
        elif line.strip() == "":
            content_start = i + 1
        else:
            break

    body = "\n".join(lines[content_start:]).strip()
    return metadata, body


def rewrite_course_file(path: Path):
    text = path.read_text(encoding="utf-8")
    metadata, body = parse_file(text)

    course_code = metadata.get("course_code", "").strip()

    if not course_code:
        print(f"Skipped {path.name}: no course_code found")
        return

    if body.startswith("Course Code:"):
        print(f"Already updated: {path.name}")
        return

    new_text = f"Course Code: {course_code}\n{body}\n"
    path.write_text(new_text, encoding="utf-8")
    print(f"Updated: {path.name}")


def main():
    files = sorted(COURSES_DIR.glob("*.txt"))
    if not files:
        print("No course files found.")
        return

    for path in files:
        rewrite_course_file(path)

    print("Done.")


if __name__ == "__main__":
    main()