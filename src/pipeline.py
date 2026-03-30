import re

from .retriever import Retriever
from .generator import Generator


def extract_course_codes(text: str) -> set[str]:
    matches = re.findall(r"\bCSE\s?\d{3}\b", text.upper())
    return {match.replace(" ", "") for match in matches}


def infer_required_prereqs(query: str, docs) -> tuple[str | None, set[str]]:
    """
    Find the target course from the user query, then try to identify its
    prerequisite courses from the retrieved documents.

    Returns:
        target_course: e.g. "CSE446" or None
        required_prereqs: set like {"CSE312", "CSE332"}
    """
    query_courses = list(extract_course_codes(query))
    if not query_courses:
        return None, set()

    target_course = query_courses[0]
    required_prereqs = set()

    for doc in docs:
        metadata = getattr(doc, "metadata", {}) or {}
        doc_course = (metadata.get("course_code", "") or "").replace(" ", "").upper()
        content = (doc.page_content or "").upper()

        # Prefer the document that matches the asked course
        if doc_course == target_course or target_course in content:
            prereq_match = re.search(
                r"PREREQUISITES?:\s*(.*?)(?:\n[A-Z][A-Z\s/]+:|\Z)",
                content,
                re.DOTALL,
            )

            search_text = prereq_match.group(1) if prereq_match else content
            codes = extract_course_codes(search_text)

            # remove the course itself if it appears
            codes.discard(target_course)
            required_prereqs.update(codes)

    return target_course, required_prereqs


def enforce_prerequisite_guardrail(query: str, docs, answer: str) -> str:
    """
    Hard validation layer for eligibility questions.

    If the user asks an eligibility question, ALL prerequisite courses must be
    explicitly mentioned in the query. If any are missing, override the model
    answer with 'Need more info'.
    """
    query_lower = query.lower()

    is_eligibility_question = (
        "can i take" in query_lower
        or "am i eligible" in query_lower
        or "eligible for" in query_lower
    )

    if not is_eligibility_question:
        return answer

    target_course, required_prereqs = infer_required_prereqs(query, docs)
    if not target_course or not required_prereqs:
        return answer

    user_courses = extract_course_codes(query)
    missing = sorted(required_prereqs - user_courses)

    if not missing:
        return answer

    citations = []
    for doc in docs:
        metadata = getattr(doc, "metadata", {}) or {}
        source = metadata.get("source", "unknown")
        course_code = metadata.get("course_code", "N/A")
        source_url = metadata.get("source_url", "N/A")
        citations.append(f"{source} | {course_code} | Main content | {source_url}")

    citations_text = "\n".join(citations) if citations else "None (No relevant information found in retrieved documents)"
    missing_text = ", ".join(missing)
    required_text = ", ".join(sorted(required_prereqs))

    return f"""Decision:
Need more info

Course Plan:
None

Evidence:
{target_course[:3]} {target_course[3:]} requires {required_text}.

Why:
The user explicitly mentioned only {", ".join(sorted(user_courses)) if user_courses else "no completed prerequisite courses"}. The following prerequisite courses are not confirmed: {missing_text}.

Next step:
Confirm whether you have completed {missing_text}.

Citations:
{citations_text}

Clarifying questions:
- Have you completed {missing_text}?
- If yes, what grade did you receive?

Assumptions / Not in catalog:
Eligibility cannot be confirmed because not all prerequisites were explicitly provided in the user input.
"""


class RAGPipeline:
    def __init__(self):
        self.retriever = Retriever()
        self.generator = Generator()

    def _build_context(self, docs):
        context_parts = []

        for idx, doc in enumerate(docs, start=1):
            metadata = doc.metadata or {}

            source = metadata.get("source", "unknown")
            course_code = metadata.get("course_code", "N/A")
            doc_type = metadata.get("type", "unknown")
            source_url = metadata.get("source_url", "N/A")

            page_content = doc.page_content.strip()

            context_parts.append(
                f"""Document {idx}
Filename: {source}
Code/Name: {course_code}
Type: {doc_type}
Source URL: {source_url}
Section/Chunk: Main content
Content:
{page_content}
"""
            )

        return "\n" + ("\n" + "=" * 80 + "\n").join(context_parts)

    def run(self, query: str):
        docs = self.retriever.retrieve(query)
        context = self._build_context(docs)
        answer = self.generator.generate(query=query, context=context)

        # Hard validation layer to prevent incorrect eligibility answers
        answer = enforce_prerequisite_guardrail(query, docs, answer)

        return {
            "answer": answer,
            "docs": docs
        }