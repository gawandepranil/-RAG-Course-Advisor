from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.pipeline import RAGPipeline

app = FastAPI(title="RAG Course Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = RAGPipeline()


class AskRequest(BaseModel):
    query: str


class SourceItem(BaseModel):
    source: str
    course_code: str = ""
    type: str = ""
    source_url: str = ""


class AskResponse(BaseModel):
    answer: str
    retrieved_sources: list[SourceItem]


@app.get("/")
def root():
    return {"message": "RAG Course Advisor API is running"}


@app.post("/ask", response_model=AskResponse)
def ask_question(payload: AskRequest):
    result = pipeline.run(payload.query)

    sources = []
    for doc in result["docs"]:
        meta = doc.metadata
        sources.append(
            SourceItem(
                source=meta.get("source", ""),
                course_code=meta.get("course_code", ""),
                type=meta.get("type", ""),
                source_url=meta.get("source_url", ""),
            )
        )

    return AskResponse(
        answer=result["answer"],
        retrieved_sources=sources
    )