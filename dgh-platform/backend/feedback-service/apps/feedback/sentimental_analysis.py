"""
Analyse de sentiment pour les feedbacks patients
Basé sur le modèle HuggingFace optimisé pour un traitement unitaire
"""
import time
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging

logger = logging.getLogger(__name__)

# Configuration du modèle HuggingFace
HF_MODEL_ID = "genie10/feedback_patients"

# Optimisations PyTorch
torch.set_grad_enabled(False)
torch.set_num_threads(1)

# Variables globales pour le modèle (chargement lazy)
_tokenizer = None
_model = None

label_mapping = {0: "negative", 1: "neutral", 2: "positive"}


def _load_model():
    """Charge le modèle de façon lazy (seulement quand nécessaire)"""
    global _tokenizer, _model
    if _tokenizer is None or _model is None:
        logger.info(f"Chargement du modèle d'analyse de sentiment: {HF_MODEL_ID}")
        
        # Diagnostic des versions
        import transformers, tokenizers
        logger.info(f"Transformers version: {transformers.__version__}")
        logger.info(f"Tokenizers version: {tokenizers.__version__}")
        
        try:
            # Essayer avec use_fast=False pour éviter les problèmes de tokenizer
            _tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID, use_fast=False)
            logger.info("Tokenizer chargé avec succès (slow tokenizer)")
        except Exception as e:
            logger.warning(f"Erreur tokenizer slow, essai avec fast: {e}")
            _tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID, use_fast=True)
            
        _model = AutoModelForSequenceClassification.from_pretrained(HF_MODEL_ID)
        _model.eval()
        logger.info("Modèle chargé avec succès")


def analyze_sentiment(text: str) -> dict:
    """
    Analyse le sentiment d'un texte unique
    
    Args:
        text: Texte du feedback à analyser
        
    Returns:
        dict: Résultat de l'analyse avec prediction, scores et temps de traitement
    """
    start = time.time()
    
    try:
        # Chargement lazy du modèle
        _load_model()
        
        # Tokenisation pour un seul texte
        inputs = _tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        
        # Inference
        logits = _model(**inputs).logits
        probs = torch.softmax(logits, dim=-1).squeeze().tolist()
        
        # Prédiction
        pred_id = int(torch.argmax(logits))
        prediction = label_mapping[pred_id]
        
        end = time.time()
        elapsed = round(end - start, 3)
        
        result = {
            "text": text,
            "prediction": prediction,
            "confidence": {
                "negative": round(probs[0] * 100, 2),
                "neutral": round(probs[1] * 100, 2),
                "positive": round(probs[2] * 100, 2)
            },
            "processing_time_seconds": elapsed
        }
        
        logger.info(f"Sentiment analysé: {prediction} en {elapsed}s")
        return result
        
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse de sentiment: {e}")
        return {
            "text": text,
            "prediction": "neutral",
            "confidence": {"negative": 33.33, "neutral": 33.33, "positive": 33.33},
            "processing_time_seconds": 0.0,
            "error": str(e)
        }


def get_sentiment_data(text: str) -> tuple:
    """
    Version simplifiée qui retourne seulement le sentiment et les scores
    
    Args:
        text: Texte à analyser
        
    Returns:
        tuple: (sentiment, scores_dict)
    """
    try:
        logger.info("Tentative d'analyse avec modèle IA...")
        result = analyze_sentiment(text)
        logger.info(f"Analyse IA réussie: {result['prediction']}")
        return result["prediction"], result["confidence"]
    except Exception as e:
        logger.warning(f"Modèle IA indisponible, utilisation du fallback: {e}")
        
        # Fallback robuste basé sur des mots-clés
        text_lower = text.lower()
        if any(word in text_lower for word in ['excellent', 'parfait', 'très bien', 'super', 'formidable', 'fantastique', 'merveilleux']):
            return "positive", {"negative": 10.0, "neutral": 20.0, "positive": 70.0}
        elif any(word in text_lower for word in ['mauvais', 'nul', 'problème', 'insatisfait', 'décevant', 'terrible', 'catastrophique', 'mal']):
            return "negative", {"negative": 70.0, "neutral": 20.0, "positive": 10.0}
        else:
            return "neutral", {"negative": 30.0, "neutral": 40.0, "positive": 30.0}