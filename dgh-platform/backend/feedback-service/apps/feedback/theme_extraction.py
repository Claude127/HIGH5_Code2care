def get_feedback_theme(sentiment: str, rating: int) -> str:
    """
    Détermine le thème basé sur le sentiment et le rating

    Args:
        sentiment: Sentiment détecté (positive, negative, neutral)
        rating: Note donnée par le patient (1-5)

    Returns:
        theme_name: Nom du thème approprié
    TODO: implement ai such as gemini/ollama for this part but this is nice for the mock
    """
    # Gestion du cas où sentiment est None ou vide
    if not sentiment:
        sentiment = "neutral"
    
    if sentiment == "positive" and rating >= 4:
        return "Satisfaction - Service excellent"
    elif sentiment == "positive" and rating >= 3:
        return "Satisfaction - Service correct"
    elif sentiment == "negative" and rating <= 2:
        return "Insatisfaction - Problème majeur"
    elif sentiment == "negative" and rating <= 3:
        return "Insatisfaction - Service à améliorer"
    elif sentiment == "neutral":
        if rating >= 4:
            return "Neutre - Globalement satisfait"
        elif rating <= 2:
            return "Neutre - Globalement insatisfait"
        else:
            return "Neutre - Service moyen"
    else:
        return "Feedback - Évaluation générale"