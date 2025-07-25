import json
import requests
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Feedback, FeedbackTheme, Patient
from .serializers import PatientSerializer

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"
from .models import FeedbackTheme  # ton modèle de thèmes

def get_existing_theme_names():
    """
    Récupère la liste des noms de thèmes déjà en base.
    """
    return list(FeedbackTheme.objects.values_list("theme_name", flat=True))

def generate_next_theme_id():
    """
    Génère un ID unique pour FeedbackTheme selon le pattern THEMExxx
    """
    last = FeedbackTheme.objects.order_by('-theme_id').first()
    if last and last.theme_id.startswith("THEME"):
        num = int(last.theme_id.replace("THEME", "")) + 1
    else:
        num = 1
    return f"THEME{num:03d}"

@api_view(['POST'])
def create_patient(request):
    """
    POST /api/patients/
    Body JSON attendu (exemple) :
    {
      "patient_id": "PAT001",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone_number": "0700000000",
      "preferred_language": "fr",
      "preferred_contact_method": 1,
      "gender": 1,
      "date_of_birth": "1980-01-15"
    }
    """
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def extract_themes(request):
    pid  = request.data.get("patient_id", "").strip()
    text = request.data.get("text", "").strip()
    if not pid or not text:
        return Response(
            {"error": "patient_id et text sont requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        patient = Patient.objects.get(patient_id=pid)
    except Patient.DoesNotExist:
        return Response(
            {"error": f"Patient {pid} introuvable"},
            status=status.HTTP_404_NOT_FOUND
        )

    text = request.data["text"]
    # 1) Récupère les thèmes déjà en base
    existing = get_existing_theme_names()  # ex. ["Qualité du service", "Temps d'attente"]
    # Construis un string listé
    themes_list = "\n".join(f"- {t}" for t in existing) if existing else "*(aucun)*"
    prompt = (
        "Contexte : tu es un assistant qui classe un retour patient "
        "dans un thème existant ou en crée un nouveau si nécessaire.\n\n"
        "Thèmes déjà existants :\n"
        f"{themes_list}\n\n"
        "Retour à classer :\n"
        f"\"{text}\"\n\n"
        "Indique **uniquement** le nom du thème adéquat. "
        "- Si le retour correspond nettement à l’un des thèmes existants, renvoie ce thème EXACTEMENT.\n"
        "- Sinon, propose un nouveau label court et générique (ex. « Qualité du service »).\n"
        "Ne renvoie rien d’autre."
    )

    payload = {"model": MODEL_NAME, "prompt": prompt, "stream": False}

    try:
        res = requests.post(OLLAMA_URL, json=payload, timeout=60)
        res.raise_for_status()
    except requests.RequestException as e:
        return Response(
            {"error": f"Échec de l’appel Ollama: {str(e)}"},
            status=status.HTTP_502_BAD_GATEWAY
        )

    data = res.json()
    raw  = data.get("response", "").strip()
    theme_name = raw.splitlines()[0].strip()
    # Parser JSON ou fallback
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, dict) and "themes" in parsed:
            theme_name = parsed["themes"][0]
        elif isinstance(parsed, list):
            theme_name = parsed[0]
        else:
            theme_name = str(parsed)
    except json.JSONDecodeError:
        theme_name = raw

    with transaction.atomic():
        # Tenter de récupérer le thème par son nom
        theme_obj = FeedbackTheme.objects.filter(theme_name=theme_name).first()
        if not theme_obj:
            # Générer un nouvel ID
            new_id = generate_next_theme_id()
            theme_obj = FeedbackTheme.objects.create(
                theme_id=new_id,
                theme_name=theme_name
            )

        feedback = Feedback.objects.create(
            patient=patient,
            input_type="text",
            language=request.data.get("language", patient.preferred_language or "fr"),
            content=text,
            status="new",
            theme=theme_obj
        )

    return Response({
        "feedback_id": feedback.feedback_id,
        "theme_id": theme_obj.theme_id,
        "theme": theme_obj.theme_name,
        "created_at": feedback.created_at
    }, status=status.HTTP_201_CREATED)