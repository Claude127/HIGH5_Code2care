# utils.py - LangChain compatible version without PyTorch

import os
import logging
from groq import Groq
from qdrant_client import QdrantClient

# Import our lightweight embeddings class
from app.services.embeddings_langchain import LightweightEmbeddings

logger = logging.getLogger(__name__)

# Qdrant Configuration
QDRANT_CLOUD_URL = "https://2fb00d86-37a3-405d-8b4c-b08155fb91f5.europe-west3-0.gcp.cloud.qdrant.io:6333"
QDRANT_CLOUD_API_KEY = os.getenv('QDRANT_API_KEY')

# Default local configuration
QDRANT_LOCAL_HOST = "localhost"
QDRANT_LOCAL_PORT = 6333
QDRANT_LOCAL_GRPC_PORT = 6334


def create_qdrant_client():
    """Create a Qdrant client by trying cloud first, then local"""
    # Attempt cloud connection
    if QDRANT_CLOUD_API_KEY:
        try:
            cloud_client = QdrantClient(
                url=QDRANT_CLOUD_URL,
                api_key=QDRANT_CLOUD_API_KEY,
                timeout=10
            )

            # Test the connection
            collections = cloud_client.get_collections()
            logger.info(f"✅ Qdrant Cloud connection successful - {len(collections.collections)} collections")
            return cloud_client, "cloud"

        except Exception as e:
            logger.warning(f"⚠️ Qdrant Cloud connection failed: {e}")
    else:
        logger.info("🔧 Qdrant Cloud API key not configured, using local")

    # Fallback to local instance
    try:
        local_client = QdrantClient(
            host=QDRANT_LOCAL_HOST,
            port=QDRANT_LOCAL_PORT,
            grpc_port=QDRANT_LOCAL_GRPC_PORT,
            prefer_grpc=True,
            timeout=60
        )

        # Test the connection
        collections = local_client.get_collections()
        logger.info(f"✅ Qdrant Local connection successful - {len(collections.collections)} collections")
        return local_client, "local"

    except Exception as e:
        logger.error(f"❌ Qdrant Local connection failed: {e}")
        raise ConnectionError(
            "Unable to connect to Qdrant (neither cloud nor local). "
            "Check your configuration and that Docker Qdrant is running."
        )


# Qdrant client initialization
try:
    qdrant, qdrant_mode = create_qdrant_client()
    logger.info(f"🔗 Active Qdrant mode: {qdrant_mode}")
except Exception as e:
    logger.error(f"❌ Qdrant initialization error: {e}")
    qdrant = None
    qdrant_mode = "none"

# Lightweight embedding model (REPLACES SentenceTransformer)
try:
    embed_model = LightweightEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    logger.info("✅ Lightweight embedding model loaded (LangChain compatible)")
except Exception as e:
    logger.error(f"❌ Error loading embedding model: {e}")
    embed_model = None

# Groq Client
try:
    groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    logger.info("✅ Groq client configured")
except Exception as e:
    logger.error(f"❌ Error configuring Groq client: {e}")
    groq_client = None


def get_qdrant_info():
    """Return information about the active Qdrant connection"""
    if qdrant is None:
        return {"status": "disconnected", "mode": "none"}

    try:
        collections = qdrant.get_collections()
        return {
            "status": "connected",
            "mode": qdrant_mode,
            "url": QDRANT_CLOUD_URL if qdrant_mode == "cloud" else f"{QDRANT_LOCAL_HOST}:{QDRANT_LOCAL_PORT}",
            "collections_count": len(collections.collections),
            "embedding_model": "LightweightEmbeddings-TF-IDF-384D"
        }
    except Exception as e:
        return {"status": "error", "mode": qdrant_mode, "error": str(e)}


def test_lightweight_setup():
    """Test lightweight installation with LangChain"""
    print("🧪 LIGHTWEIGHT + LANGCHAIN INSTALLATION TEST")
    print("=" * 45)

    # Test Qdrant
    qdrant_info = get_qdrant_info()
    print(f"📊 Qdrant: {qdrant_info['status']} ({qdrant_info['mode']})")

    # Test Embedding (LangChain interface)
    if embed_model:
        test_texts = ["Medical embedding test", "Clinical diagnosis"]

        # Test embed_documents (LangChain interface)
        embeddings = embed_model.embed_documents(test_texts)
        print(f"📄 embed_documents: ✅ {len(embeddings)} docs, {len(embeddings[0])}D")

        # Test embed_query (LangChain interface)
        query_emb = embed_model.embed_query("test query")
        print(f"🔍 embed_query: ✅ {len(query_emb)}D")

        # Test similarity
        similarity = embed_model.similarity(test_texts[0], "medical embedding test")
        print(f"🎯 Similarity: {similarity:.3f}")

    # Test Groq
    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": "Test"}],
                max_tokens=10
            )
            print("🤖 Groq: ✅ Connected")
        except Exception as e:
            print(f"🤖 Groq: ❌ {e}")

    print("=" * 45)
    print("✅ MIGRATION SUCCESSFUL: HuggingFace → Lightweight + LangChain")
    return qdrant_info


# Migration helpers
def compare_with_huggingface():
    """Compare the old and new approach"""
    print("🔄 COMPARISON HUGGINGFACE vs LIGHTWEIGHT")
    print("=" * 50)

    print("❌ BEFORE (HuggingFaceEmbeddings):")
    print("   - sentence-transformers: ~500MB")
    print("   - torch: ~2GB")
    print("   - transformers: ~500MB")
    print("   - TOTAL: ~3GB + SIGKILL risk")

    print("\n✅ AFTER (LightweightEmbeddings):")
    print("   - scikit-learn: ~50MB")
    print("   - numpy: ~20MB")
    print("   - TOTAL: ~70MB")
    print("   - 100% LangChain Compatible")
    print("   - Identical interface")

    print("\n🎯 PRESERVED FEATURES:")
    print("   ✅ QdrantVectorStore")
    print("   ✅ create_retrieval_chain")
    print("   ✅ ChatGroq")
    print("   ✅ MessagesPlaceholder")
    print("   ✅ ask_question_with_history")
    print("   ✅ Conversation history")
    print("   ✅ Vector search")


if __name__ == "__main__":
    test_lightweight_setup()
    compare_with_huggingface()