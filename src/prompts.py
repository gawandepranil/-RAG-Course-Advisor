SYSTEM_PROMPT = """
You are a catalog-grounded academic planning assistant.

STRICT RULES:
- Use ONLY the provided context.
- Do NOT summarize loosely.
- Extract exact prerequisite details as written.
- Do NOT simplify or omit important conditions (like minimum grades).

IF INFORMATION IS NOT PRESENT:
Say exactly:
"I don’t have that information in the provided catalog/policies."

ELIGIBILITY RULES:
- If user asks "Can I take X?" and student info is missing:
  → DO NOT answer Yes/No
  → Say "Need more info"
  → Ask required clarifying questions

PREREQUISITE RULES:
- List ALL prerequisites exactly
- Include:
  - all required courses
  - minimum grade (if present)
  - logical structure ("All of", "One of")

CITATION RULES:
- DO NOT say "Document 1"
- ALWAYS include:
  - course code
  - file name
  - source URL

OUTPUT FORMAT (STRICT — NO DEVIATION):

Answer / Plan:
Why:
Citations:
Clarifying questions:
Assumptions / Not in catalog:

RULES:
- You MUST include ALL sections, even if empty
- If no clarifying questions:
  write: None
- If no assumptions:
  write: None

FAIL IF:
- format is not followed
- citations are missing
- minimum grade is ignored
"""

def format_context(docs) -> str:
    chunks = []

    for i, doc in enumerate(docs, 1):
        metadata = getattr(doc, "metadata", {}) or {}

        source = metadata.get("source", "unknown")
        doc_type = metadata.get("type", "unknown")
        course_code = metadata.get("course_code", "")
        source_url = metadata.get("source_url", "")
        section = metadata.get("section", "")
        chunk_id = metadata.get("chunk_id", "")
        title = metadata.get("title", "")

        lines = [
            f"[Document {i}]",
            f"Source File: {source}",
            f"Type: {doc_type}",
        ]

        if title:
            lines.append(f"Title: {title}")
        if course_code:
            lines.append(f"Course Code: {course_code}")
        if source_url:
            lines.append(f"Source URL: {source_url}")
        if section:
            lines.append(f"Section: {section}")
        if chunk_id:
            lines.append(f"Chunk ID: {chunk_id}")

        lines.append("")
        lines.append("Content:")
        lines.append((doc.page_content or "").strip())

        chunks.append("\n".join(lines))

    return "\n\n".join(chunks)


def build_user_prompt(query: str, docs) -> str:
    context = format_context(docs)

    return f"""Context:
{context}

User Question:
{query}

Important instructions:
- Use only the context above.
- Do not guess.
- Do not use outside knowledge.
- Under Citations, include only directly supporting documents.
- Each citation must include source file name, course code if available, source URL if available, section if available, and chunk id if available.
- If the answer is not supported by the retrieved context, write exactly under Citations:
  None (No relevant information found in retrieved documents)

Answer using the exact required format:

Answer / Plan:
Decision:
Evidence:
Why:
Next step:
Citations:
Clarifying questions:
Assumptions / Not in catalog:"""