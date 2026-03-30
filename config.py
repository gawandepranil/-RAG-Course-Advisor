import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "models"
FAISS_PATH = MODEL_DIR / "faiss_index"

# Embeddings
EMBED_MODEL = "BAAI/bge-small-en-v1.5"

# Retrieval
TOP_K = 4

# Groq LLM
GROQ_MODEL = "llama-3.1-8b-instant"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Generation settings
MAX_TOKENS = 500
TEMPERATURE = 0.1