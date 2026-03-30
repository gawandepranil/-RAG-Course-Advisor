from pathlib import Path
from langchain_core.documents import Document
from config import DATA_DIR


DEFAULT_COURSE_SOURCE_URL = "https://www.washington.edu/students/crscat/cse.html"


def clean_content(text: str) -> str:
    lines = []

    for line in text.splitlines():
        low = line.strip().lower()

        if low.startswith("filename:"):
            continue
        if low.startswith("source_url:"):
            continue
        if low.startswith("course_code:"):
            continue
        if low.startswith("document_type:"):
            continue
        if low.startswith("date accessed:"):
            continue

        lines.append(line)

    return "\n".join(lines).strip()


def extract_course_code(text: str) -> str:
    for line in text.splitlines():
        stripped = line.strip()
        low = stripped.lower()

        if low.startswith("course code:"):
            return stripped.split(":", 1)[1].strip()

        if low.startswith("course_code:"):
            return stripped.split(":", 1)[1].strip()

    return ""


def extract_source_url(text: str) -> str:
    for line in text.splitlines():
        stripped = line.strip()
        low = stripped.lower()

        if low.startswith("source_url:"):
            return stripped.split(":", 1)[1].strip()

        if low.startswith("source url:"):
            return stripped.split(":", 1)[1].strip()

    return ""


def normalize_type(folder_name: str) -> str:
    mapping = {
        "courses": "course",
        "programs": "program",
        "policies": "policy",
    }
    return mapping.get(folder_name.lower(), folder_name.lower())


def load_documents():
    documents = []

    for folder in ["courses", "programs", "policies"]:
        folder_path = DATA_DIR / folder

        if not folder_path.exists():
            continue

        for file in sorted(folder_path.glob("*.txt")):
            raw = file.read_text(encoding="utf-8")
            doc_type = normalize_type(folder)

            course_code = extract_course_code(raw)
            source_url = extract_source_url(raw)

            if doc_type == "course" and not source_url:
                source_url = DEFAULT_COURSE_SOURCE_URL

            doc = Document(
                page_content=clean_content(raw),
                metadata={
                    "source": file.name,
                    "type": doc_type,
                    "course_code": course_code,
                    "source_url": source_url,
                },
            )

            documents.append(doc)

    print(f"Loaded {len(documents)} documents")
    return documents