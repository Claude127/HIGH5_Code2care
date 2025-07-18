import uuid

from django.db import models


class Department(models.Model):
    department_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name


class Patient(models.Model):
    patient_id = models.CharField(max_length=10, primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=50, null=True, blank=True)
    preferred_language = models.CharField(max_length=50, null=True, blank=True)
    preferred_contact_method = models.IntegerField(null=True, blank=True)
    gender = models.IntegerField(null=True, blank=True)
    date_of_birth = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Professional(models.Model):
    professional_id = models.CharField(max_length=10, primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateTimeField()
    gender = models.CharField(max_length=50, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.RESTRICT)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class FeedbackTheme(models.Model):
    theme_id = models.CharField(max_length=10, primary_key=True)
    theme_name = models.TextField()

    def __str__(self):
        return self.theme_name


class Appointment(models.Model):
    appointment_id = models.CharField(max_length=10, primary_key=True)
    scheduled_date = models.DateField()
    status = models.CharField(max_length=50)
    type = models.CharField(max_length=50, null=True, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT)
    professional = models.ForeignKey(Professional, on_delete=models.RESTRICT)

    def __str__(self):
        return f"{self.appointment_id} - {self.scheduled_date}"


class Reminder(models.Model):
    reminder_id = models.CharField(max_length=10, primary_key=True)
    channel = models.CharField(max_length=50)
    scheduled_time = models.TimeField()
    status = models.CharField(max_length=50)
    message_content = models.CharField(max_length=50, null=True, blank=True)
    language = models.CharField(max_length=50, null=True, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.RESTRICT)
    appointment = models.ForeignKey(Appointment, on_delete=models.RESTRICT)

    def __str__(self):
        return self.reminder_id


class Feedback(models.Model):
    feedback_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey("Patient", on_delete=models.RESTRICT)
    input_type = models.CharField(max_length=50)
    language = models.CharField(max_length=10)
    content = models.TextField()
    status = models.CharField(max_length=20)
    theme = models.ForeignKey("FeedbackTheme", on_delete=models.RESTRICT)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class Medication(models.Model):
    medication_id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=50)
    dosage = models.IntegerField()
    frequency = models.FloatField()

    def __str__(self):
        return self.name


class Ordonance(models.Model):
    ordonance_id = models.CharField(max_length=10, primary_key=True)
    date = models.DateField()

    def __str__(self):
        return self.ordonance_id


class Prescription(models.Model):
    prescription_id = models.CharField(max_length=10, primary_key=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    instructions = models.TextField(null=True, blank=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.RESTRICT)

    def __str__(self):
        return self.prescription_id


class PrescriptionMedication(models.Model):
    medication = models.ForeignKey(Medication, on_delete=models.RESTRICT)
    prescription = models.ForeignKey(Prescription, on_delete=models.RESTRICT)

    class Meta:
        unique_together = ("medication", "prescription")


class PrescriptionOrdonance(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.RESTRICT)
    ordonance = models.ForeignKey(Ordonance, on_delete=models.RESTRICT)

    class Meta:
        unique_together = ("prescription", "ordonance")
