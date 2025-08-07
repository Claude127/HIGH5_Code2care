# app/services/rag_groq.py - Version with lazy loading and error handling

import os
from typing import Tuple, Optional, List
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import logging

# LANGCHAIN IMPORTS (lightweight version)
from langchain_qdrant import QdrantVectorStore, RetrievalMode
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, AIMessage, Document
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

# Our lightweight embeddings class (LangChain compatible)
from .embeddings_langchain import LightweightEmbeddings

logger = logging.getLogger(__name__)

# Qdrant Configuration
QDRANT_CLOUD_URL = "https://2fb00d86-37a3-405d-8b4c-b08155fb91f5.europe-west3-0.gcp.cloud.qdrant.io:6333"
QDRANT_CLOUD_API_KEY = os.getenv('QDRANT_API_KEY')

# Global variables for caching (lazy loading)
_client = None
_client_mode = None
_embedder = None
_retrieval_chain = None


def get_embedder():
    """Get embedder with lazy initialization"""
    global _embedder
    if _embedder is None:
        _embedder = LightweightEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return _embedder


def get_qdrant_client() -> Tuple[Optional[QdrantClient], str]:
    """Get Qdrant client with cloud -> local fallback and robust error handling"""
    global _client, _client_mode

    # Return cached client if it exists
    if _client is not None:
        return _client, _client_mode

    # Try cloud first (PRIORITY)
    if QDRANT_CLOUD_API_KEY:
        try:
            logger.info("🌐 Attempting Qdrant Cloud connection...")
            cloud_client = QdrantClient(
                url=QDRANT_CLOUD_URL,
                api_key=QDRANT_CLOUD_API_KEY,
                timeout=10  # Reduced timeout to avoid blocking
            )
            # Test connection with a real request
            collections = cloud_client.get_collections()
            logger.info(f"🌐 ✅ Qdrant Cloud connected - {len(collections.collections)} collections")
            _client = cloud_client
            _client_mode = "cloud"
            return _client, _client_mode
        except Exception as e:
            logger.warning(f"⚠️ Qdrant Cloud unavailable: {e}")
    else:
        logger.warning("🔑 QDRANT_API_KEY not configured - cannot use cloud")

    # Fallback to local only if cloud fails
    try:
        logger.info("🏠 Attempting Qdrant Local connection...")
        local_client = QdrantClient(
            host="localhost",
            port=6333,
            grpc_port=6334,
            prefer_grpc=True,
            timeout=5  # Even shorter timeout for local
        )
        collections = local_client.get_collections()
        logger.info(f"🏠 ✅ Qdrant Local connected - {len(collections.collections)} collections")
        _client = local_client
        _client_mode = "local"
        return _client, _client_mode
    except Exception as e:
        logger.error(f"❌ Qdrant Local unavailable: {e}")

    # If everything fails, offline mode
    logger.error("❌ No Qdrant available (neither cloud nor local) - Offline mode")
    _client = None
    _client_mode = "offline"
    return _client, _client_mode


def ensure_collection_exists():
    """Ensure the Qdrant collection exists, create it if it doesn't"""
    client, client_mode = get_qdrant_client()

    if not client or client_mode == "offline":
        logger.warning("⚠️ No Qdrant client available to create collection")
        return False

    collection_name = "clinical_summaries"

    try:
        # Try to get collection info
        collection_info = client.get_collection(collection_name)
        logger.info(f"✅ Collection '{collection_name}' exists on {client_mode}")
        return True
    except Exception as e:
        if "doesn't exist" in str(e) or "Not found" in str(e) or "404" in str(e):
            logger.warning(f"⚠️ Collection '{collection_name}' doesn't exist, creating...")
            try:
                # Create the collection with appropriate vector size
                client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(
                        size=384,  # Dimension for all-MiniLM-L6-v2
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"✅ Collection '{collection_name}' created on {client_mode}")
                return True
            except Exception as create_error:
                logger.error(f"❌ Failed to create collection: {create_error}")
                return False
        else:
            logger.error(f"❌ Error checking collection: {e}")
            return False


def get_qdrant_store():
    """Get QdrantVectorStore instance, creating collection if needed"""
    client, client_mode = get_qdrant_client()

    if not client or client_mode == "offline":
        raise Exception("Qdrant client not available - offline mode")

    if ensure_collection_exists():
        embedder = get_embedder()
        return QdrantVectorStore(
            client=client,
            collection_name="clinical_summaries",
            embedding=embedder,
            retrieval_mode=RetrievalMode.DENSE,
        )
    else:
        raise Exception("Unable to initialize Qdrant collection")


def get_retrieval_chain():
    """Get the retrieval chain with lazy initialization and caching"""
    global _retrieval_chain

    # Return cached chain if it exists
    if _retrieval_chain is not None:
        return _retrieval_chain

    try:
        client, client_mode = get_qdrant_client()

        if not client or client_mode == "offline":
            raise Exception("Qdrant not available - cannot create retrieval chain")

        qdrant_store = get_qdrant_store()

        retriever = qdrant_store.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 4, "fetch_k": 20, "lambda_mult": 0.5},
        )

        llm = ChatGroq(
            model_name="llama-3.1-8b-instant",
            temperature=0.3,
            streaming=False,
        )

        # Prompt template with history
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", f"""You are an expert medical assistant. Use the provided context and conversation history to answer precisely and contextually.

Medical context:
{{context}}

Instructions:
- Answer in English or French based on the question
- Be precise and professional
- Use history to maintain consistency
- If you don't know, say it clearly
- Data source: Qdrant {client_mode}"""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])

        # Document chain with correct variables
        document_chain = create_stuff_documents_chain(llm, prompt_template)
        _retrieval_chain = create_retrieval_chain(retriever, document_chain)

        logger.info(f"✅ Retrieval chain initialized (mode: {client_mode})")
        return _retrieval_chain
    except Exception as e:
        logger.error(f"❌ Failed to initialize chain: {e}")
        raise


def ask_question_with_history(question: str, chat_history: list):
    """Ask a question with chat history context - Version with robust fallback"""
    try:
        client, client_mode = get_qdrant_client()

        # If Qdrant is not available, return a fallback response
        if not client or client_mode == "offline":
            logger.warning("⚠️ Qdrant not available - using LLM fallback")
            return fallback_llm_response(question, chat_history)

        # Get the retrieval chain (lazy initialization)
        retrieval_chain = get_retrieval_chain()

        # Convert history to LangChain messages
        history_messages = []
        for role, content in chat_history:
            if role == "human":
                history_messages.append(HumanMessage(content=content))
            elif role == "ai":
                history_messages.append(AIMessage(content=content))

        logger.info(f"🤖 Question: {question[:50]}... (history: {len(history_messages)} messages)")

        # Execute the chain
        result = retrieval_chain.invoke({
            "input": question,
            "chat_history": history_messages
        })

        # Retrieve source documents if available
        context_docs = result.get("context", [])

        logger.info(f"✅ Response generated with RAG (sources: {len(context_docs)})")
        return result["answer"], context_docs

    except Exception as e:
        logger.error(f"❌ Error in ask_question_with_history: {e}")
        # Fallback in case of error
        return fallback_llm_response(question, chat_history, error=str(e))


def fallback_llm_response(question: str, chat_history: list, error: str = None):
    """Fallback response using only LLM without RAG"""
    try:
        llm = ChatGroq(
            model_name="llama-3.1-8b-instant",
            temperature=0.3,
            streaming=False,
        )

        # Build context from history
        context = ""
        if chat_history:
            context = "\n".join([f"{role}: {content}" for role, content in chat_history[-5:]])  # Last 5 messages

        # Simplified prompt without RAG
        system_msg = """You are a medical assistant. Answer professionally and precisely.

IMPORTANT: Clearly indicate that you don't currently have access to the specialized knowledge base."""

        if error:
            system_msg += f"\n\nTechnical note: {error}"

        messages = [
            {"role": "system", "content": system_msg},
        ]

        if context:
            messages.append({"role": "system", "content": f"Recent conversation context:\n{context}"})

        messages.append({"role": "user", "content": question})

        response = llm.invoke(messages)

        fallback_note = "\n\n⚠️ Response generated without access to specialized knowledge base."

        logger.info("✅ Fallback response generated")
        return response.content + fallback_note, []

    except Exception as fallback_error:
        logger.error(f"❌ Error even in fallback: {fallback_error}")
        error_msg = f"Sorry, a technical error occurred. Please try again later."
        if error:
            error_msg += f"\n\nDetails: {error}"
        return error_msg, []


def get_qdrant_status():
    """Return Qdrant connection status with lazy loading"""
    try:
        client, client_mode = get_qdrant_client()

        if not client or client_mode == "offline":
            return {
                "status": "offline",
                "mode": "offline",
                "error": "No Qdrant client available",
                "embedding_model": "lightweight-tfidf-384d"
            }

        collections = client.get_collections()
        collection_names = [c.name for c in collections.collections]

        return {
            "status": "connected",
            "mode": client_mode,
            "collections_count": len(collections.collections),
            "collections": collection_names,
            "url": QDRANT_CLOUD_URL if client_mode == "cloud" else "localhost:6333",
            "has_clinical_summaries": "clinical_summaries" in collection_names,
            "embedding_model": "lightweight-tfidf-384d"
        }
    except Exception as e:
        return {
            "status": "error",
            "mode": _client_mode or "unknown",
            "error": str(e),
            "embedding_model": "lightweight-tfidf-384d"
        }


def add_sample_documents():
    """Add some sample documents to the collection for testing"""
    try:
        client, client_mode = get_qdrant_client()

        if not client or client_mode == "offline":
            raise Exception("Qdrant not available to add documents")

        qdrant_store = get_qdrant_store()

        sample_docs = [
            "Type 2 diabetes is a chronic disease characterized by insulin resistance.",
            "High blood pressure is a major risk factor for cardiovascular disease.",
            "Symptoms of angina include chest pain and shortness of breath.",
            "Pneumonia is a lung infection that can be caused by bacteria or viruses.",
            "Congestive heart failure affects the heart's ability to pump blood efficiently."

        ]

        # Convert to LangChain Documents
        documents = [Document(page_content=doc, metadata={"source": "sample", "id": i})
                     for i, doc in enumerate(sample_docs)]

        # Add via LangChain
        qdrant_store.add_documents(documents)
        logger.info(f"✅ {len(sample_docs)} sample documents added on {client_mode}")

    except Exception as e:
        logger.error(f"❌ Failed to add sample documents: {e}")
        raise


def diagnose_qdrant():
    """Diagnostic function to debug issues"""
    print("🔍 QDRANT DIAGNOSTIC (CORRECTED VERSION)")
    print("=" * 50)

    print(f"🔑 QDRANT_API_KEY configured: {'✅ Yes' if QDRANT_CLOUD_API_KEY else '❌ No'}")
    print(f"🌐 Cloud URL: {QDRANT_CLOUD_URL}")

    # Connection test
    client, client_mode = get_qdrant_client()
    print(f"🔗 Current mode: {client_mode}")
    print(f"🧠 Embeddings: LightweightEmbeddings (TF-IDF + fallbacks, 384D)")

    status = get_qdrant_status()
    print(f"📊 Status: {status}")

    if status["status"] == "connected":
        print(f"📚 Collections: {status.get('collections', [])}")
        print(f"🩺 clinical_summaries collection: {'✅' if status.get('has_clinical_summaries') else '❌'}")

    # Test embeddings
    try:
        embedder = get_embedder()
        test_embedding = embedder.embed_query("medical test")
        print(f"🔢 Embedding test: ✅ {len(test_embedding)} dimensions")
    except Exception as e:
        print(f"🔢 Embedding test: ❌ {e}")

    return status


# Export main functions (identical interface)
__all__ = [
    "ask_question_with_history",
    "get_qdrant_status",
    "add_sample_documents",
    "diagnose_qdrant",
    "get_embedder",
    "get_qdrant_client"
]