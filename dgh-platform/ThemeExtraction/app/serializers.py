from rest_framework import serializers
from .models import Patient, Feedback, FeedbackTheme

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class FeedbackThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackTheme
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    theme   = FeedbackThemeSerializer(read_only=True)

    class Meta:
        model = Feedback
        fields = ['feedback_id', 'created_at', 'input_type', 'language', 'context', 'status', 'theme', 'patient']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'patient_id',
            'first_name',
            'last_name',
            'phone_number',
            'preferred_language',
            'preferred_contact_method',
            'gender',
            'date_of_birth',
        ]