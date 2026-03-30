import re
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from config import EMBED_MODEL, FAISS_PATH, TOP_K


class Retriever:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)

        self.db = FAISS.load_local(
            str(FAISS_PATH),
            self.embeddings,
            allow_dangerous_deserialization=True
        )

    def extract_course_code(self, query: str):
        match = re.search(r"\b[A-Z]{2,5}\s?\d{3}\b", query.upper())
        return match.group(0).replace(" ", "") if match else None

    def retrieve(self, query: str):
        results = []
        seen = set()

        # -------- STEP 1: Find target course --------
        course_code = self.extract_course_code(query)

        target_doc = None

        if course_code:
            for doc in self.db.docstore._dict.values():
                doc_code = doc.metadata.get("course_code", "").upper().replace(" ", "")
                key = doc.metadata.get("source", "")

                if doc_code == course_code and key not in seen:
                    results.append(doc)
                    seen.add(key)
                    target_doc = doc

        # -------- STEP 2: Extract prerequisites --------
        prereq_codes = set()

        if target_doc:
            for line in target_doc.page_content.splitlines():
                matches = re.findall(r"\b[A-Z]{2,5}\s?\d{3}\b", line.upper())
                for m in matches:
                    cleaned = m.replace(" ", "")
                    if cleaned != course_code:
                        prereq_codes.add(cleaned)

        # -------- STEP 3: Fetch prerequisite docs --------
        for code in prereq_codes:
            for doc in self.db.docstore._dict.values():
                doc_code = doc.metadata.get("course_code", "").upper().replace(" ", "")
                key = doc.metadata.get("source", "")

                if doc_code == code and key not in seen:
                    results.append(doc)
                    seen.add(key)

        # -------- STEP 4: Add semantic fallback --------
        semantic_docs = self.db.similarity_search(query, k=TOP_K)

        for doc in semantic_docs:
            key = doc.metadata.get("source", "")
            if key not in seen:
                results.append(doc)
                seen.add(key)

        return results[:TOP_K]