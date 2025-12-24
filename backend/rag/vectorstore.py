from langchain_community.vectorstores import Chroma
from rag.models import embeddings

def create_vectorstore(chunks, session_id: str):
    return Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=f"chroma_db/{session_id}"
    )

def load_vectorstore(session_id: str):
    return Chroma(
        persist_directory=f"chroma_db/{session_id}",
        embedding_function=embeddings
    )
