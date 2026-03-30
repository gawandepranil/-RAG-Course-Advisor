from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from .prompts import SYSTEM_PROMPT
from config import GROQ_MODEL, GROQ_API_KEY


class Generator:
    def __init__(self):
        self.llm = ChatGroq(
            model=GROQ_MODEL,
            groq_api_key=GROQ_API_KEY,
            temperature=0
        )

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            (
                "human",
                """Student Question:
{query}

Retrieved Documents:
{context}

Use only the retrieved documents above.
Return the answer strictly in the required structure."""
            )
        ])

        self.chain = self.prompt | self.llm

    def generate(self, query: str, context: str) -> str:
        response = self.chain.invoke({
            "query": query,
            "context": context
        })
        return response.content