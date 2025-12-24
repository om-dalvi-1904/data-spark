from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os

from rag.pdf_loader import load_pdf
from rag.text_splitter import split_documents
from rag.vectorstore import create_vectorstore
from rag.chat_history import create_session, add_message, get_history
from rag.rag_chain import run_rag

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/hello")
def hello():
    return {"message": "Hello World"}

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    session_id = str(uuid.uuid4())
    os.makedirs("data", exist_ok=True)

    pdf_path = f"data/{session_id}.pdf"
    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    documents = load_pdf(pdf_path)
    chunks = split_documents(documents)
    create_vectorstore(chunks, session_id)
    create_session(session_id)

    return {"session_id": session_id}

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat/{session_id}")
def chat(session_id: str, req: ChatRequest):
    history = get_history(session_id)

    answer = run_rag(
        session_id=session_id,
        user_input=req.message,
        chat_history=history
    )

    add_message(session_id, "user", req.message)
    add_message(session_id, "assistant", answer)

    return {"answer": answer}
