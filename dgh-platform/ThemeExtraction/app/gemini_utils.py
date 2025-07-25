import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # Charge les variables d'environnement à partir de .env

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("⚠️ GEMINI_API_KEY manquante dans le fichier .env")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-pro')


def extract_themes_with_gemini(feedback: str) -> str:
    prompt = f"""
    Voici un avis patient : "{feedback}"
    Donne-moi les thèmes principaux abordés dans ce feedback.
    Format de réponse JSON :
    [
      {{ "theme": "Nom du thème", "description": "Brève explication" }}
    ]
    """
    response = model.generate_content(prompt)
    return response.text
import google.generativeai as genai
from django.conf import settings

# 1) Configure la librairie avec la clé chargée depuis settings
genai.configure(api_key=settings.GEMINI_API_KEY)

# 2) Sélection du modèle
gemini_model = genai.GenerativeModel("gemini-pro")

def call_gemini_extract_theme(feedback: str) -> str:
    prompt = (
        "Nous sommes dans un contexte médical. Extrait le thème principal de ce texte "
        "et renvoie-le sous forme de liste JSON : {\"themes\": [\"...\"]}\n\n"
        f"{feedback}"
    )
    # 3) Lancement de l'inférence
    response = gemini_model.generate_content(prompt)
    return response.text.strip()

