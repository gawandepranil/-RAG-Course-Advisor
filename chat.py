from src.pipeline import RAGPipeline


def main():
    pipeline = RAGPipeline()

    print("\nCourse Advisor is ready.")
    print("Type 'exit' to quit.\n")

    while True:
        query = input("Ask: ").strip()

        if query.lower() in {"exit", "quit"}:
            print("Goodbye!")
            break

        if not query:
            print("Please enter a question.\n")
            continue

        result = pipeline.run(query)

        print("\n" + "=" * 70)
        print("QUESTION:")
        print(result["query"])

        print("\nANSWER:")
        print(result["answer"])

        print("\nRETRIEVED SOURCES:")
        for i, doc in enumerate(result["docs"], 1):
            print(
                f"{i}. source={doc.metadata.get('source', '')}, "
                f"course_code={doc.metadata.get('course_code', '')}, "
                f"type={doc.metadata.get('type', '')}"
            )

        print("=" * 70 + "\n")


if __name__ == "__main__":
    main()