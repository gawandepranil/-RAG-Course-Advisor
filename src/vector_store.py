from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from config import EMBED_MODEL, FAISS_PATH
from src.ingestion import load_documents


def build_vector_store():
    docs = load_documents()

    print(docs[0].metadata)

    for doc in docs:
        if doc.metadata.get("source") == "course_18.txt":
            print("COURSE 18 METADATA:", doc.metadata)
            print("COURSE 18 CONTENT:", doc.page_content[:300])

    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)

    vector_store = FAISS.from_documents(docs, embeddings)

    vector_store.save_local(str(FAISS_PATH))

    print("FAISS index created and saved")


if __name__ == "__main__":
    build_vector_store()