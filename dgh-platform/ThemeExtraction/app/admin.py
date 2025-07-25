from django.contrib import admin
from .models import (
    Department,
    Patient,
    Professional,
    FeedbackTheme,
    Appointment,
    Reminder,
    Feedback,
    Medication,
    Ordonance,
    Prescription,
    PrescriptionMedication,
    PrescriptionOrdonance,
)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("department_id", "name", "description")
    search_fields = ("name",)

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("patient_id", "first_name", "last_name", "gender", "date_of_birth")
    search_fields = ("first_name", "last_name", "patient_id")

@admin.register(Professional)
class ProfessionalAdmin(admin.ModelAdmin):
    list_display = ("professional_id", "first_name", "last_name", "department", "gender")
    search_fields = ("first_name", "last_name", "professional_id")
    list_filter = ("department",)

@admin.register(FeedbackTheme)
class FeedbackThemeAdmin(admin.ModelAdmin):
    list_display = ("theme_id", "theme_name")
    search_fields = ("theme_name",)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("appointment_id", "scheduled_date", "status", "patient", "professional")
    list_filter = ("status", "scheduled_date")
    search_fields = ("appointment_id",)

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ("reminder_id", "channel", "scheduled_time", "status", "patient", "appointment")
    list_filter = ("status", "channel")
    search_fields = ("reminder_id",)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("feedback_id", "patient", "theme", "input_type", "status")
    list_filter = ("status", "language")
    search_fields = ("feedback_id", "content")

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ("medication_id", "name", "dosage", "frequency")
    search_fields = ("name",)

@admin.register(Ordonance)
class OrdonanceAdmin(admin.ModelAdmin):
    list_display = ("ordonance_id", "date")
    list_filter = ("date",)
    search_fields = ("ordonance_id",)

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ("prescription_id", "start_date", "end_date", "appointment")
    list_filter = ("start_date", "end_date")
    search_fields = ("prescription_id",)

@admin.register(PrescriptionMedication)
class PrescriptionMedicationAdmin(admin.ModelAdmin):
    list_display = ("prescription", "medication")
    autocomplete_fields = ("prescription", "medication")

@admin.register(PrescriptionOrdonance)
class PrescriptionOrdonanceAdmin(admin.ModelAdmin):
    list_display = ("prescription", "ordonance")
    autocomplete_fields = ("prescription", "ordonance")
    search_fields = ("prescription_id",)
