from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_history_aware_retriever
from langchain_core.prompts import ChatPromptTemplate

from rag.models import llm
from rag.vectorstore import load_vectorstore

def run_rag(session_id: str, user_input: str, chat_history: list):
    vectorstore = load_vectorstore(session_id)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    contextualize_prompt = ChatPromptTemplate.from_template(
        """
        Given the chat history and the latest user question,
        rewrite the question so it can be understood on its own.

        Chat History:
        {chat_history}

        Question:
        {input}
        """
    )

    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_prompt
    )

    qa_prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            "You are a helpful educational assistant. "
            "Answer the question using ONLY the context provided. "
            "If the answer is not in the context, say 'I don't know'.\n\n"
            "Context:\n{context}"
        ),
        ("human", "{input}")
    ])

    qa_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(
        history_aware_retriever,
        qa_chain
    )

    result = rag_chain.invoke({
        "input": user_input,
        "chat_history": chat_history
    })

    return result["answer"]
