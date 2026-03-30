from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.pipeline import RAGPipeline

app = FastAPI(title="RAG Course Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = RAGPipeline()

class AskRequest(BaseModel):
    query: str

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/ask")
def ask_question(request: AskRequest):
    query = request.query.strip()

    if not query:
        return {
            "answer": "Please enter a question.",
            "retrieved_sources": []
        }

    result = rag.run(query)

    sources = []
    for doc in result["docs"]:
        sources.append({
            "source": doc.metadata.get("source", ""),
            "course_code": doc.metadata.get("course_code", ""),
            "type": doc.metadata.get("type", ""),
            "source_url": doc.metadata.get("source_url", "")
        })

    return {
        "answer": result["answer"],
        "retrieved_sources": sources
    }