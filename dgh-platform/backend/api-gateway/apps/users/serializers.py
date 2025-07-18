# api-gateway/apps/users/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Patient, Professional


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone_number', 'user_type', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at']


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'patient_id', 'first_name', 'last_name', 'date_of_birth',
            'gender', 'preferred_language', 'preferred_contact_method',
            'user', 'age'
        ]

    def get_age(self, obj):
        from datetime import date
        if obj.date_of_birth:
            today = date.today()
            return today.year - obj.date_of_birth.year - (
                    (today.month, today.day) <
                    (obj.date_of_birth.month, obj.date_of_birth.day)
            )
        return None


class ProfessionalSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Professional
        fields = [
            'professional_id', 'first_name', 'last_name', 'gender',
            'date_of_birth', 'department_id', 'specialization',
            'license_number', 'user'
        ]


class RegisterPatientSerializer(serializers.ModelSerializer):
    user = serializers.DictField(write_only=True)

    class Meta:
        model = Patient
        fields = [
            'user', 'patient_id', 'first_name', 'last_name',
            'date_of_birth', 'gender', 'preferred_language',
            'preferred_contact_method'
        ]

    def validate_user(self, value):
        # Valider les données utilisateur
        if not value.get('username') or not value.get('password'):
            raise serializers.ValidationError("Username and password are required")

        # Valider le mot de passe
        validate_password(value['password'])

        # Vérifier l'unicité
        if User.objects.filter(username=value['username']).exists():
            raise serializers.ValidationError("Username already exists")

        if User.objects.filter(phone_number=value.get('phone_number')).exists():
            raise serializers.ValidationError("Phone number already registered")

        return value


class RegisterProfessionalSerializer(serializers.ModelSerializer):
    user = serializers.DictField(write_only=True)

    class Meta:
        model = Professional
        fields = [
            'user', 'professional_id', 'first_name', 'last_name',
            'gender', 'date_of_birth', 'department_id',
            'specialization', 'license_number'
        ]

    def validate_license_number(self, value):
        if Professional.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("License number already registered")
        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)