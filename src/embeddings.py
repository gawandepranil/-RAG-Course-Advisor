from sentence_transformers import SentenceTransformer
import numpy as np
from config import EMBED_MODEL


class EmbeddingModel:
    def __init__(self, model_name: str = EMBED_MODEL):
        self.model = SentenceTransformer(model_name)

    def encode_texts(self, texts: list[str]) -> np.ndarray:
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=True
        )
        return embeddings.astype("float32")

    def encode_query(self, query: str) -> np.ndarray:
        embedding = self.model.encode(
            [query],
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        return embedding.astype("float32")