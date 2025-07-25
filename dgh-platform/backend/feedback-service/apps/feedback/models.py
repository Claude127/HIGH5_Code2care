from django.db import models
from django.utils import timezone
import uuid


class Department(models.Model):
    department_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'departments'
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
    
    def __str__(self):
        return self.name


class FeedbackTheme(models.Model):
    theme_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    theme_name = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'feedback_themes'
        verbose_name = 'Feedback Theme'
        verbose_name_plural = 'Feedback Themes'
    
    def __str__(self):
        return self.theme_name[:50]


class Feedback(models.Model):
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('en', 'English'), 
        ('dua', 'Dua'),
        ('bas', 'Bas'),
        ('ewo', 'Ewo'),
    ]
    
    INPUT_TYPE_CHOICES = [
        ('text', 'Text'),
        ('audio', 'Audio'),
    ]
    
    RATING_CHOICES = [
        (1, '1 - Très insatisfait'),
        (2, '2 - Insatisfait'),
        (3, '3 - Neutre'),
        (4, '4 - Satisfait'),
        (5, '5 - Très satisfait'),
    ]
    
    feedback_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    input_type = models.CharField(max_length=10, choices=INPUT_TYPE_CHOICES, default='text')
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='fr')
    description = models.TextField()
    rating = models.IntegerField(choices=RATING_CHOICES)
    
    # Relations avec API Gateway (UUID references)
    patient_id = models.UUIDField()  # Reference vers Patient
    department_id = models.UUIDField()  # Reference vers Department
    
    # Relations locales - theme généré automatiquement
    theme = models.ForeignKey(FeedbackTheme, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Analyse de sentiment (généré automatiquement)
    sentiment = models.CharField(max_length=20, choices=[
        ('positive', 'Positif'),
        ('negative', 'Négatif'),
        ('neutral', 'Neutre'),
    ], null=True, blank=True)
    sentiment_positive_score = models.FloatField(null=True, blank=True, help_text="Score positif (0-100)")
    sentiment_negative_score = models.FloatField(null=True, blank=True, help_text="Score négatif (0-100)")
    sentiment_neutral_score = models.FloatField(null=True, blank=True, help_text="Score neutre (0-100)")
    
    # Métadonnées de traitement
    is_processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'feedbacks'
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedbacks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['patient_id']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Feedback {self.feedback_id} - {self.input_type}"


class Appointment(models.Model):
    appointment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scheduled_date = models.DateField()
    time = models.TimeField()
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default='scheduled')
    
    # Relations avec API Gateway
    patient_id = models.UUIDField()  # Reference vers Patient
    professional_id = models.UUIDField()  # Reference vers Professional
    
    # Relation locale
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
        ordering = ['scheduled_date', 'time']
        indexes = [
            models.Index(fields=['patient_id']),
            models.Index(fields=['professional_id']),
            models.Index(fields=['scheduled_date']),
        ]
    
    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.scheduled_date}"


class Reminder(models.Model):
    CHANNEL_CHOICES = [
        ('sms', 'SMS'),
        ('voice', 'Voice Call'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    reminder_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    scheduled_time = models.DateTimeField()
    send_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='pending')
    message_content = models.TextField()
    language = models.CharField(max_length=10, default='fr')
    
    # Relations
    patient_id = models.UUIDField()  # Reference vers Patient
    prescription_id = models.UUIDField(null=True, blank=True)  # Reference vers Prescription
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reminders'
        verbose_name = 'Reminder'
        verbose_name_plural = 'Reminders'
        ordering = ['scheduled_time']
        indexes = [
            models.Index(fields=['patient_id']),
            models.Index(fields=['scheduled_time']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Reminder {self.reminder_id} - {self.channel}"


class Medication(models.Model):
    medication_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.FloatField()  # Fréquence par jour
    
    class Meta:
        db_table = 'medications'
        verbose_name = 'Medication'
        verbose_name_plural = 'Medications'
    
    def __str__(self):
        return f"{self.name} - {self.dosage}"


class Prescription(models.Model):
    prescription_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    general_notes = models.TextField(blank=True)
    
    # Relations avec API Gateway
    appointment_id = models.UUIDField()  # Reference vers Appointment
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'prescriptions'
        verbose_name = 'Prescription'
        verbose_name_plural = 'Prescriptions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['appointment_id']),
        ]
    
    def __str__(self):
        return f"Prescription {self.prescription_id}"


class PrescriptionMedication(models.Model):
    prescription_medication_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    frequency = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField()
    instructions = models.TextField(blank=True)
    
    # Relations locales
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medications')
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'prescription_medications'
        verbose_name = 'Prescription Medication'
        verbose_name_plural = 'Prescription Medications'
    
    def __str__(self):
        return f"{self.prescription.prescription_id} - {self.medication.name}"