from src.vector_store import build_vector_store
from src.retriever import Retriever

if __name__ == "__main__":
    build_vector_store()

    retriever = Retriever()

    queries = [
        "What is CSE 446?",
        "Tell me about Machine Learning"
    ]

    for query in queries:
        results = retriever.retrieve(query)

        print("\n" + "=" * 60)
        print("QUERY:", query)

        for i, doc in enumerate(results, 1):
            print(f"\nRESULT {i}")
            print("METADATA:", doc.metadata)
            print("CONTENT:", doc.page_content[:300])