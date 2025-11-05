from django.contrib import admin
from .models import Patient, MedicalRecord

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['patient_id', 'full_name', 'email', 'phone', 'blood_group', 'registered_date', 'is_active']
    list_filter = ['blood_group', 'gender', 'is_active', 'registered_date']
    search_fields = ['patient_id', 'first_name', 'last_name', 'email', 'phone']
    readonly_fields = ['patient_id', 'registered_date', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('patient_id', 'first_name', 'last_name', 'date_of_birth', 'gender', 'blood_group')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address', 'city', 'state', 'zip_code')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation')
        }),
        ('Medical Information', {
            'fields': ('allergies', 'chronic_conditions', 'current_medications')
        }),
        ('System Information', {
            'fields': ('user', 'registered_date', 'updated_at', 'is_active')
        }),
    )

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'visit_date', 'diagnosis']
    list_filter = ['visit_date', 'doctor']
    search_fields = ['patient__first_name', 'patient__last_name', 'diagnosis']
    date_hierarchy = 'visit_date'
