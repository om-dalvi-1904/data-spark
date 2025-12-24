from langchain_community.document_loaders import PyPDFLoader

def load_pdf(pdf_path: str):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    if len(documents) > 50:
        raise ValueError("PDF exceeds 50 pages")

    return documents
