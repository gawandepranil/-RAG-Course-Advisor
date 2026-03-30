from src.retriever import Retriever
from src.generator import Generator


class RAGPipeline:
    def __init__(self):
        self.retriever = Retriever()
        self.generator = Generator()

    def run(self, query):
        docs = self.retriever.retrieve(query)
        answer = self.generator.generate(query, docs)

        return {
            "query": query,
            "answer": answer,
            "docs": docs
        }