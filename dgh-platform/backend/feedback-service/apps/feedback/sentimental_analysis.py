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

# Chargement du modèle (une seule fois)
tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID)
model = AutoModelForSequenceClassification.from_pretrained(HF_MODEL_ID)
model.eval()

label_mapping = {0: "negative", 1: "neutral", 2: "positive"}


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
        # Tokenisation pour un seul texte
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        
        # Inference
        logits = model(**inputs).logits
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
    result = analyze_sentiment(text)
    return result["prediction"], result["confidence"]