# api-gateway/apps/users/views.py
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db import transaction
from .models import User, Patient, Professional
from .serializers import (
    UserSerializer, PatientSerializer, ProfessionalSerializer,
    LoginSerializer, RegisterPatientSerializer, RegisterProfessionalSerializer
)
import logging

logger = logging.getLogger(__name__)


class RegisterPatientView(generics.CreateAPIView):
    """Inscription des patients"""
    serializer_class = RegisterPatientSerializer
    permission_classes = [AllowAny]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Créer l'utilisateur
        user_data = serializer.validated_data.pop('user')
        user = User.objects.create_user(
            username=user_data['username'],
            password=user_data['password'],
            phone_number=user_data['phone_number'],
            user_type='patient'
        )

        # Créer le profil patient
        patient = Patient.objects.create(
            user=user,
            **serializer.validated_data
        )

        # Générer les tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'patient': PatientSerializer(patient).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class RegisterProfessionalView(generics.CreateAPIView):
    """Inscription des professionnels de santé"""
    serializer_class = RegisterProfessionalSerializer
    permission_classes = [AllowAny]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Créer l'utilisateur
        user_data = serializer.validated_data.pop('user')
        user = User.objects.create_user(
            username=user_data['username'],
            password=user_data['password'],
            phone_number=user_data['phone_number'],
            user_type='professional'
        )

        # Créer le profil professionnel
        professional = Professional.objects.create(
            user=user,
            **serializer.validated_data
        )

        # Générer les tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'professional': ProfessionalSerializer(professional).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Connexion pour patients et professionnels"""
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Récupérer le profil selon le type
    profile_data = {}
    if user.user_type == 'patient':
        try:
            patient = Patient.objects.get(user=user)
            profile_data = PatientSerializer(patient).data
        except Patient.DoesNotExist:
            pass
    elif user.user_type == 'professional':
        try:
            professional = Professional.objects.get(user=user)
            profile_data = ProfessionalSerializer(professional).data
        except Professional.DoesNotExist:
            pass

    # Générer les tokens
    refresh = RefreshToken.for_user(user)

    # Log de connexion
    logger.info(f"User {user.username} ({user.user_type}) logged in successfully")

    return Response({
        'user': UserSerializer(user).data,
        'profile': profile_data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    })


@api_view(['POST'])
def logout_view(request):
    """Déconnexion avec blacklist du token"""
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({"detail": "Successfully logged out"})
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

