"""
Schémas Swagger pour les endpoints feedback de l'API Gateway
"""
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status


# Schémas de données pour Swagger
feedback_create_schema = {
    "type": "object",
    "properties": {
        "description": {
            "type": "string",
            "description": "Description du feedback du patient",
            "example": "Le service médical était excellent, personnel très professionnel"
        },
        "rating": {
            "type": "integer",
            "minimum": 1,
            "maximum": 5,
            "description": "Note de satisfaction (1-5)",
            "example": 4
        },
        "language": {
            "type": "string",
            "enum": ["fr", "en", "dua", "bas", "ewo"],
            "description": "Langue du feedback",
            "example": "fr"
        },
        "input_type": {
            "type": "string",
            "enum": ["text", "audio"],
            "description": "Type d'input",
            "example": "text"
        },
        "department_id": {
            "type": "string",
            "format": "uuid",
            "description": "ID du département concerné",
            "example": "87654321-4321-4321-4321-cba987654321"
        }
    },
    "required": ["description", "rating", "department_id"]
}

feedback_response_schema = {
    "type": "object",
    "properties": {
        "message": {
            "type": "string",
            "example": "Feedback créé avec succès"
        },
        "feedback": {
            "type": "object",
            "properties": {
                "feedback_id": {
                    "type": "string",
                    "format": "uuid",
                    "example": "123e4567-e89b-12d3-a456-426614174000"
                },
                "description": {"type": "string"},
                "rating": {"type": "integer"},
                "language": {"type": "string"},
                "input_type": {"type": "string"},
                "created_at": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2025-07-23T10:30:00Z"
                },
                "is_processed": {
                    "type": "boolean",
                    "example": False
                }
            }
        },
        "processing_info": {
            "type": "string",
            "example": "L'analyse de sentiment se fait automatiquement en arrière-plan"
        }
    }
}

feedback_status_schema = {
    "type": "object",
    "properties": {
        "feedback_id": {
            "type": "string",
            "format": "uuid"
        },
        "is_processed": {
            "type": "boolean",
            "description": "Indique si le feedback a été traité"
        },
        "processed_at": {
            "type": "string",
            "format": "date-time",
            "nullable": True
        },
        "sentiment": {
            "type": "string",
            "enum": ["positive", "negative", "neutral"],
            "nullable": True,
            "description": "Sentiment détecté"
        },
        "sentiment_scores": {
            "type": "object",
            "properties": {
                "positive": {"type": "number", "format": "float"},
                "negative": {"type": "number", "format": "float"},
                "neutral": {"type": "number", "format": "float"}
            }
        },
        "theme": {
            "type": "string",
            "nullable": True,
            "description": "Thème extrait automatiquement"
        },
        "description": {"type": "string"},
        "rating": {"type": "integer"}
    }
}

test_feedback_schema = {
    "type": "object",
    "properties": {
        "message": {"type": "string"},
        "feedback": {"type": "object"},
        "test_info": {
            "type": "object",
            "properties": {
                "description": {"type": "string"},
                "check_status_url": {"type": "string"},
                "wait_time": {"type": "string"}
            }
        }
    }
}

# Décorateurs pour les vues avec drf_yasg
create_feedback_decorator = swagger_auto_schema(
    methods=['POST'],
    operation_id="create_patient_feedback",
    operation_summary="Créer un nouveau feedback",
    operation_description="""
    Permet à un patient authentifié de créer un nouveau feedback.
    
    **Processus automatique :**
    1. Le feedback est créé immédiatement
    2. L'analyse de sentiment se fait automatiquement en arrière-plan
    3. Un thème est extrait et assigné au feedback
    4. Le patient peut vérifier le statut via l'endpoint de statut
    
    **Champs requis :** description, rating, department_id
    **Patient_id :** Automatiquement assigné depuis l'authentification
    """,
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['description', 'rating', 'department_id'],
        properties={
            'description': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='Description du feedback du patient',
                example='Le service médical était excellent, personnel très professionnel'
            ),
            'rating': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                minimum=1,
                maximum=5,
                description='Note de satisfaction (1-5)',
                example=4
            ),
            'language': openapi.Schema(
                type=openapi.TYPE_STRING,
                enum=['fr', 'en', 'dua', 'bas', 'ewo'],
                description='Langue du feedback',
                example='fr'
            ),
            'input_type': openapi.Schema(
                type=openapi.TYPE_STRING,
                enum=['text', 'audio'],
                description='Type d\'input',
                example='text'
            ),
            'department_id': openapi.Schema(
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                description='ID du département concerné',
                example='87654321-4321-4321-4321-cba987654321'
            )
        }
    ),
    responses={
        201: openapi.Response(
            description='Feedback créé avec succès',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'feedback': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'feedback_id': openapi.Schema(type=openapi.TYPE_STRING),
                            'description': openapi.Schema(type=openapi.TYPE_STRING),
                            'rating': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                            'is_processed': openapi.Schema(type=openapi.TYPE_BOOLEAN)
                        }
                    ),
                    'processing_info': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        400: openapi.Response(description='Champs manquants'),
        403: openapi.Response(description='Accès réservé aux patients'),
        503: openapi.Response(description='Service temporairement indisponible')
    },
    tags=['Feedback Patient']
)

my_feedbacks_decorator = swagger_auto_schema(
    methods=['GET'],
    operation_id="get_my_feedbacks",
    operation_summary="Récupérer mes feedbacks",
    operation_description="Récupère tous les feedbacks du patient authentifié avec leur statut de traitement",
    manual_parameters=[
        openapi.Parameter(
            'date_from',
            openapi.IN_QUERY,
            description="Filtrer par date de début",
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE
        ),
        openapi.Parameter(
            'date_to',
            openapi.IN_QUERY,
            description="Filtrer par date de fin", 
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE
        )
    ],
    responses={
        200: openapi.Response(
            description='Liste des feedbacks du patient',
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'feedback_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'description': openapi.Schema(type=openapi.TYPE_STRING),
                        'rating': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'sentiment': openapi.Schema(type=openapi.TYPE_STRING),
                        'is_processed': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'created_at': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        ),
        403: openapi.Response(description='Accès réservé aux patients')
    },
    tags=['Feedback Patient']
)

feedback_status_decorator = swagger_auto_schema(
    methods=['GET'],
    operation_id="get_feedback_status",
    operation_summary="Vérifier le statut d'un feedback", 
    operation_description="Vérifie le statut de traitement d'un feedback spécifique avec sentiment et thème",
    responses={
        200: openapi.Response(
            description='Statut du feedback',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'feedback_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'is_processed': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                    'sentiment': openapi.Schema(type=openapi.TYPE_STRING, enum=['positive', 'negative', 'neutral']),
                    'sentiment_scores': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'positive': openapi.Schema(type=openapi.TYPE_NUMBER),
                            'negative': openapi.Schema(type=openapi.TYPE_NUMBER),
                            'neutral': openapi.Schema(type=openapi.TYPE_NUMBER)
                        }
                    ),
                    'theme': openapi.Schema(type=openapi.TYPE_STRING),
                    'processed_at': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        403: openapi.Response(description='Accès réservé aux patients'),
        404: openapi.Response(description='Feedback non trouvé')
    },
    tags=['Feedback Patient']
)

test_feedback_decorator = swagger_auto_schema(
    methods=['POST'],
    operation_id="create_test_feedback",
    operation_summary="Créer un feedback de test",
    operation_description="Crée un feedback de test avec des données par défaut pour tester le système",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'description': openapi.Schema(type=openapi.TYPE_STRING, description='Override description'),
            'rating': openapi.Schema(type=openapi.TYPE_INTEGER, description='Override rating'),
            'language': openapi.Schema(type=openapi.TYPE_STRING, description='Override langue'),
            'department_id': openapi.Schema(type=openapi.TYPE_STRING, description='Override département')
        }
    ),
    responses={
        201: openapi.Response(
            description='Feedback de test créé',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'feedback': openapi.Schema(type=openapi.TYPE_OBJECT),
                    'test_info': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'check_status_url': openapi.Schema(type=openapi.TYPE_STRING),
                            'wait_time': openapi.Schema(type=openapi.TYPE_STRING)
                        }
                    )
                }
            )
        ),
        403: openapi.Response(description='Accès réservé aux patients')
    },
    tags=['Feedback Patient - Test']
)


# ========== APPOINTMENT SCHEMAS ==========

appointment_create_schema = {
    "type": "object",
    "properties": {
        "scheduled": {
            "type": "string",
            "format": "date-time",
            "description": "Date et heure du rendez-vous",
            "example": "2025-07-30T14:30:00Z"
        },
        "type": {
            "type": "string",
            "enum": ["consultation", "suivi", "examen"],
            "description": "Type de rendez-vous",
            "example": "consultation"
        },
        "patient_id": {
            "type": "string",
            "format": "uuid",
            "description": "ID du patient (auto-assigné si patient connecté)",
            "example": "12345678-1234-1234-1234-123456789abc"
        },
        "professional_id": {
            "type": "string",
            "format": "uuid",
            "description": "ID du professionnel (auto-assigné si professionnel connecté)",
            "example": "87654321-4321-4321-4321-cba987654321"
        }
    },
    "required": ["scheduled", "type"]
}

appointment_response_schema = {
    "type": "object",
    "properties": {
        "appointment_id": {
            "type": "string",
            "format": "uuid",
            "example": "123e4567-e89b-12d3-a456-426614174000"
        },
        "scheduled": {
            "type": "string",
            "format": "date-time",
            "example": "2025-07-30T14:30:00Z"
        },
        "type": {
            "type": "string",
            "example": "consultation"
        },
        "patient_id": {
            "type": "string",
            "format": "uuid"
        },
        "professional_id": {
            "type": "string",
            "format": "uuid"
        },
        "created_at": {
            "type": "string",
            "format": "date-time"
        },
        "updated_at": {
            "type": "string",
            "format": "date-time"
        }
    }
}

# Décorateurs Swagger pour Appointments
list_appointments_decorator = swagger_auto_schema(
    methods=['GET'],
    operation_id="list_appointments",
    operation_summary="Lister les rendez-vous",
    operation_description="""
    Récupère la liste des rendez-vous selon le type d'utilisateur :
    - **Patients** : Voir leurs propres rendez-vous
    - **Professionnels** : Voir leurs rendez-vous assignés
    
    Supporte la pagination et le filtrage par dates.
    """,
    manual_parameters=[
        openapi.Parameter(
            'type',
            openapi.IN_QUERY,
            description="Filtrer par type de rendez-vous",
            type=openapi.TYPE_STRING,
            enum=['consultation', 'suivi', 'examen']
        ),
        openapi.Parameter(
            'date_from',
            openapi.IN_QUERY,
            description="Date de début pour filtrer",
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE
        ),
        openapi.Parameter(
            'date_to',
            openapi.IN_QUERY,
            description="Date de fin pour filtrer",
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE
        )
    ],
    responses={
        200: openapi.Response(
            description='Liste des rendez-vous',
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'appointment_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'scheduled': openapi.Schema(type=openapi.TYPE_STRING),
                        'type': openapi.Schema(type=openapi.TYPE_STRING),
                        'patient_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'professional_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'created_at': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        ),
        403: openapi.Response(description='Type d\'utilisateur non supporté'),
        404: openapi.Response(description='Profil utilisateur introuvable')
    },
    tags=['Appointments']
)

create_appointment_decorator = swagger_auto_schema(
    methods=['POST'],
    operation_id="create_appointment",
    operation_summary="Créer un rendez-vous",
    operation_description="""
    Crée un nouveau rendez-vous.
    
    **Auto-assignation :**
    - Si **patient connecté** : patient_id automatiquement assigné
    - Si **professionnel connecté** : professional_id automatiquement assigné
    
    **Champs requis :** scheduled, type
    """,
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['scheduled', 'type'],
        properties={
            'scheduled': openapi.Schema(
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATETIME,
                description='Date et heure du rendez-vous',
                example='2025-07-30T14:30:00Z'
            ),
            'type': openapi.Schema(
                type=openapi.TYPE_STRING,
                enum=['consultation', 'suivi', 'examen'],
                description='Type de rendez-vous',
                example='consultation'
            ),
            'patient_id': openapi.Schema(
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                description='ID du patient (optionnel si patient connecté)',
                example='12345678-1234-1234-1234-123456789abc'
            ),
            'professional_id': openapi.Schema(
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_UUID,
                description='ID du professionnel (optionnel si professionnel connecté)',
                example='87654321-4321-4321-4321-cba987654321'
            )
        }
    ),
    responses={
        201: openapi.Response(
            description='Rendez-vous créé avec succès',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'appointment_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'scheduled': openapi.Schema(type=openapi.TYPE_STRING),
                    'type': openapi.Schema(type=openapi.TYPE_STRING),
                    'patient_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'professional_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'created_at': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        400: openapi.Response(description='Données invalides'),
        403: openapi.Response(description='Type d\'utilisateur non supporté')
    },
    tags=['Appointments']
)

get_appointment_decorator = swagger_auto_schema(
    methods=['GET'],
    operation_id="get_appointment",
    operation_summary="Récupérer un rendez-vous",
    operation_description="Récupère les détails d'un rendez-vous spécifique",
    responses={
        200: openapi.Response(
            description='Détails du rendez-vous',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'appointment_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'scheduled': openapi.Schema(type=openapi.TYPE_STRING),
                    'type': openapi.Schema(type=openapi.TYPE_STRING),
                    'patient_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'professional_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'created_at': openapi.Schema(type=openapi.TYPE_STRING),
                    'updated_at': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        403: openapi.Response(description='Accès non autorisé'),
        404: openapi.Response(description='Rendez-vous non trouvé')
    },
    tags=['Appointments']
)

update_appointment_decorator = swagger_auto_schema(
    methods=['PUT', 'PATCH'],
    operation_id="update_appointment",
    operation_summary="Modifier un rendez-vous",
    operation_description="""
    Met à jour un rendez-vous existant.
    
    - **PUT** : Mise à jour complète
    - **PATCH** : Mise à jour partielle
    """,
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'scheduled': openapi.Schema(
                type=openapi.TYPE_STRING,
                format=openapi.FORMAT_DATETIME,
                description='Nouvelle date/heure'
            ),
            'type': openapi.Schema(
                type=openapi.TYPE_STRING,
                enum=['consultation', 'suivi', 'examen'],
                description='Nouveau type'
            )
        }
    ),
    responses={
        200: openapi.Response(
            description='Rendez-vous mis à jour',
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'appointment_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'scheduled': openapi.Schema(type=openapi.TYPE_STRING),
                    'type': openapi.Schema(type=openapi.TYPE_STRING),
                    'updated_at': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )
        ),
        400: openapi.Response(description='Données invalides'),
        403: openapi.Response(description='Accès non autorisé'),
        404: openapi.Response(description='Rendez-vous non trouvé')
    },
    tags=['Appointments']
)

delete_appointment_decorator = swagger_auto_schema(
    methods=['DELETE'],
    operation_id="delete_appointment",
    operation_summary="Supprimer un rendez-vous",
    operation_description="Supprime définitivement un rendez-vous",
    responses={
        204: openapi.Response(description='Rendez-vous supprimé avec succès'),
        403: openapi.Response(description='Accès non autorisé'),
        404: openapi.Response(description='Rendez-vous non trouvé')
    },
    tags=['Appointments']
)

upcoming_appointments_decorator = swagger_auto_schema(
    methods=['GET'],
    operation_id="upcoming_appointments",
    operation_summary="Rendez-vous à venir",
    operation_description="Récupère tous les rendez-vous programmés dans le futur",
    responses={
        200: openapi.Response(
            description='Liste des rendez-vous à venir',
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'appointment_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'scheduled': openapi.Schema(type=openapi.TYPE_STRING),
                        'type': openapi.Schema(type=openapi.TYPE_STRING),
                        'patient_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'professional_id': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        ),
        403: openapi.Response(description='Accès non autorisé')
    },
    tags=['Appointments']
)

today_appointments_decorator = swagger_auto_schema(
    methods=['GET'],
    operation_id="today_appointments",
    operation_summary="Rendez-vous du jour",
    operation_description="Récupère tous les rendez-vous prévus aujourd'hui",
    responses={
        200: openapi.Response(
            description='Liste des rendez-vous du jour',
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'appointment_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'scheduled': openapi.Schema(type=openapi.TYPE_STRING),
                        'type': openapi.Schema(type=openapi.TYPE_STRING),
                        'patient_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'professional_id': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        ),
        403: openapi.Response(description='Accès non autorisé')
    },
    tags=['Appointments']
)