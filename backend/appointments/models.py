from django.db import models
from accounts.models import User
from patients.models import Patient

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )
    
    APPOINTMENT_TYPE_CHOICES = (
        ('consultation', 'Consultation'),
        ('follow_up', 'Follow-up'),
        ('check_up', 'Check-up'),
        ('emergency', 'Emergency'),
        ('vaccination', 'Vaccination'),
        ('lab_test', 'Lab Test'),
    )
    
    appointment_id = models.CharField(max_length=20, unique=True, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments', limit_choices_to={'role': 'doctor'})
    
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    duration = models.IntegerField(default=30, help_text="Duration in minutes")
    
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPE_CHOICES, default='consultation')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    reason = models.TextField(help_text="Reason for appointment")
    notes = models.TextField(blank=True, help_text="Additional notes")
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_appointments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    assigned_nurse = models.ForeignKey(
        User, null=True, blank=True, 
        on_delete=models.SET_NULL,
        related_name='nurse_appointments',
        limit_choices_to={'role': 'nurse'}
    )
    
    class Meta:
        ordering = ['appointment_date', 'appointment_time']
        unique_together = ['doctor', 'appointment_date', 'appointment_time']
    
    def __str__(self):
        return f"{self.appointment_id} - {self.patient.full_name} with Dr. {self.doctor.last_name}"
    
    def save(self, *args, **kwargs):
        if not self.appointment_id:
            # Generate unique appointment ID
            last_appointment = Appointment.objects.order_by('-id').first()
            if last_appointment:
                last_id = int(last_appointment.appointment_id.split('-')[1])
                self.appointment_id = f"APT-{str(last_id + 1).zfill(6)}"
            else:
                self.appointment_id = "APT-000001"
        super().save(*args, **kwargs)
    
    @property
    def is_upcoming(self):
        from datetime import date, time, datetime
        now = datetime.now()
        appointment_datetime = datetime.combine(self.appointment_date, self.appointment_time)
        return appointment_datetime > now and self.status in ['scheduled', 'confirmed']
