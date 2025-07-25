"""
Settings package pour le projet Django.
"""
import os

# Déterminer l'environnement à partir de la variable DJANGO_SETTINGS_MODULE
settings_module = os.environ.get('DJANGO_SETTINGS_MODULE', 'config.settings.development')

if 'production' in settings_module:
    from .production import *
else:
    from .development import *
