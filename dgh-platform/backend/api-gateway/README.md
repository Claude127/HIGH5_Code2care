# API Gateway - DGH Platform

API Gateway pour le système de santé numérique DGH (Digital Global Health). Ce service sert de point d'entrée unique pour tous les microservices de la plateforme.

## Architecture

L'API Gateway route intelligemment les requêtes vers les microservices appropriés :

- **FEEDBACK_SERVICE** : Gestion des retours, rendez-vous, rappels et prescriptions
- **CHAT_SERVICE** : Service de chat et messagerie
- **ANALYTICS_SERVICE** : Analyses et banque de sang

## Fonctionnalités

- ✅ **Routage intelligent** vers les microservices
- ✅ **Authentification JWT** avec refresh tokens
- ✅ **Inscription** patients et professionnels de santé
- ✅ **Health checks** pour monitoring
- ✅ **Tracing des requêtes** avec IDs uniques
- ✅ **Documentation Swagger** intégrée
- ✅ **Cache Redis** pour les performances
- ✅ **CORS** configuré pour les frontends

## Installation et Démarrage en Local

### Prérequis

- Python 3.10+
- Redis (optionnel mais recommandé)
- Git

### 1. Clonage et Setup

```bash
# Cloner le projet
git clone <repository-url>
cd dgh-platform/backend/api-gateway

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
# ou
venv\\Scripts\\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt
```

### 2. Configuration

Le fichier `.env` a été créé avec les paramètres par défaut :

```env
# Django Settings
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Redis Cache
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Microservices URLs
FEEDBACK_SERVICE_URL=http://localhost:8001
CHAT_SERVICE_URL=http://localhost:8002
ANALYTICS_SERVICE_URL=http://localhost:8003
```

### 3. Base de données

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superuser (optionnel)
python manage.py createsuperuser
```

### 4. Démarrage des services

#### Option A : Avec Redis (recommandé)
```bash
# Terminal 1 : Démarrer Redis
redis-server

# Terminal 2 : Démarrer l'API Gateway
python manage.py runserver 0.0.0.0:8000
```

#### Option B : Sans Redis
```bash
# Commenter la configuration Redis dans settings/base.py
# ou modifier REDIS_URL dans .env vers une instance distante

python manage.py runserver 0.0.0.0:8000
```

### 5. Vérification

L'API Gateway sera accessible sur `http://localhost:8000`

#### Endpoints de test :
- **Health Check** : `GET http://localhost:8000/health/`
- **Services Status** : `GET http://localhost:8000/health/services/`
- **Swagger UI** : `http://localhost:8000/swagger/`
- **Admin** : `http://localhost:8000/admin/`

## Utilisation

### Authentification

#### Inscription Patient
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/patient/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "user": {
      "username": "patient1",
      "password": "securepass123",
      "phone_number": "+237612345678"
    },
    "date_of_birth": "1990-01-01",
    "gender": "M",
    "address": "Yaoundé, Cameroun"
  }'
```

#### Inscription Professionnel
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/professional/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "user": {
      "username": "doctor1",
      "password": "securepass123",
      "phone_number": "+237612345679"
    },
    "specialization": "Cardiologie",
    "license_number": "MD12345",
    "hospital": "Hôpital Central Yaoundé"
  }'
```

#### Connexion
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "patient1",
    "password": "securepass123"
  }'
```

### Routage vers les Microservices

Les requêtes sont automatiquement routées :

```bash
# Vers FEEDBACK_SERVICE
curl -X GET http://localhost:8000/api/v1/feedback/ \\
  -H "Authorization: Bearer <access_token>"

# Vers CHAT_SERVICE
curl -X GET http://localhost:8000/api/v1/chat/ \\
  -H "Authorization: Bearer <access_token>"

# Vers ANALYTICS_SERVICE
curl -X GET http://localhost:8000/api/v1/analytics/ \\
  -H "Authorization: Bearer <access_token>"
```

## Structure du Projet

```
api-gateway/
├── apps/
│   ├── common/          # Utilitaires partagés
│   ├── gateway/         # Logique de routage
│   │   ├── middleware.py    # Middlewares de routage et tracing
│   │   ├── routers.py      # Logique de routage intelligent
│   │   └── views.py        # Health checks
│   └── users/           # Gestion des utilisateurs
│       ├── models.py       # Modèles User, Patient, Professional
│       ├── serializers.py  # Sérializers DRF
│       └── views.py        # Vues d'authentification
├── config/
│   ├── settings/
│   │   ├── base.py         # Configuration de base
│   │   ├── development.py  # Config développement
│   │   └── production.py   # Config production
│   └── urls.py             # URLs principales
├── requirements.txt        # Dépendances Python
├── manage.py              # Script de gestion Django
└── .env                   # Variables d'environnement
```

## Monitoring et Logging

### Health Checks
- **Gateway** : `GET /health/`
- **All Services** : `GET /health/services/`

### Logs
Les logs incluent :
- Request IDs uniques pour le tracing
- Temps de réponse
- Erreurs de routage
- Statuts des microservices

### Métriques
- Headers `X-Request-ID` et `X-Response-Time` dans chaque réponse
- Logs structurés pour monitoring

## Développement

### Ajouter un nouveau microservice

1. Mettre à jour `MICROSERVICES` dans `config/settings/base.py`
2. Ajouter les routes dans `ServiceRouter.ROUTE_MAPPING`
3. Mettre à jour le fichier `.env`

### Tests

```bash
# Lancer les tests
python manage.py test

# Lancer les tests avec coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## Configuration Production

Pour la production, modifier :

1. **Variables d'environnement** dans `.env`
2. **Settings** : utiliser `config.settings.production`
3. **Base de données** : PostgreSQL recommandé
4. **Redis** : Instance dédiée
5. **CORS** : URLs spécifiques du frontend

## Dépannage

### Erreurs communes

1. **Port 8000 déjà utilisé** : 
   ```bash
   python manage.py runserver 8001
   ```

2. **Redis non disponible** :
   - Vérifier que Redis est démarré
   - Ou modifier `REDIS_URL` dans `.env`

3. **Erreurs de migration** :
   ```bash
   python manage.py makemigrations --empty <app_name>
   ```

### Logs utiles

```bash
# Voir les logs en temps réel
tail -f /var/log/django/api-gateway.log

# Logs Django en mode debug
python manage.py runserver --verbosity=2
```

## Support

Pour des questions ou problèmes :
- Créer une issue sur le repository
- Contacter l'équipe technique : tech@dgh.cm

---

**Développé avec ❤️ pour la santé numérique au Cameroun**