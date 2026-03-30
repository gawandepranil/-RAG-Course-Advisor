from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from src.prompts import SYSTEM_PROMPT, format_context
from config import GROQ_MODEL, GROQ_API_KEY, TEMPERATURE


class Generator:
    def __init__(self):
        self.llm = ChatGroq(
            model=GROQ_MODEL,
            groq_api_key=GROQ_API_KEY,
            temperature=TEMPERATURE
        )

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "Context:\n{context}\n\nUser Question:\n{question}\n\nAnswer using the exact required format.")
        ])

    def generate(self, query, docs):
        context = format_context(docs)

        chain = self.prompt | self.llm

        response = chain.invoke({
            "context": context,
            "question": query
        })

        return response.content