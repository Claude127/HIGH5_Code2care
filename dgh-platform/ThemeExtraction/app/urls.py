from django.urls import path
from .views import create_patient, extract_themes

urlpatterns = [
    path('patients/', create_patient, name='create-patient'),
    path('extract-themes/', extract_themes, name='extract-themes'),
]
