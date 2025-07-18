# api-gateway/apps/gateway/urls.py
from django.urls import path
from .views import health_check, service_status

urlpatterns = [
    path('', health_check, name='health-check'),
    path('services/', service_status, name='service-status'),
]