from django.db import models
from accounts.models import User

class Patient(models.Model):
    BLOOD_GROUP_CHOICES = (
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    )
    
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    
    # Link to User account (if patient has login access)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='patient_profile')
    
    # Basic Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    
    # Contact Information
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    
    # Emergency Contact
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=15)
    emergency_contact_relation = models.CharField(max_length=50)
    
    # Medical Information
    allergies = models.TextField(blank=True, help_text="List of allergies")
    chronic_conditions = models.TextField(blank=True, help_text="Chronic medical conditions")
    current_medications = models.TextField(blank=True, help_text="Current medications")
    
    # System Fields
    patient_id = models.CharField(max_length=20, unique=True, editable=False)
    registered_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    assigned_nurse = models.ForeignKey(
        User, null=True, blank=True, 
        on_delete=models.SET_NULL,
        related_name='nurse_patients',
        limit_choices_to={'role': 'nurse'}
    )
    
    class Meta:
        ordering = ['-registered_date']
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.patient_id})"
    
    def save(self, *args, **kwargs):
        if not self.patient_id:
            # Generate unique patient ID
            last_patient = Patient.objects.order_by('-id').first()
            if last_patient:
                last_id = int(last_patient.patient_id.split('-')[1])
                self.patient_id = f"PAT-{str(last_id + 1).zfill(6)}"
            else:
                self.patient_id = "PAT-000001"
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))


class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'doctor'})
    
    visit_date = models.DateTimeField()
    diagnosis = models.TextField()
    symptoms = models.TextField()
    prescription = models.TextField(blank=True)
    lab_results = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    
    # Vitals
    blood_pressure = models.CharField(max_length=20, blank=True)
    temperature = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    heart_rate = models.IntegerField(null=True, blank=True)
    respiratory_rate = models.IntegerField(null=True, blank=True)
    oxygen_saturation = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-visit_date']
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.visit_date.date()}"


class PatientAssignmentLog(models.Model):
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE, related_name='assignment_logs')
    assigned_nurse = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    assigned_by = models.ForeignKey(User, related_name='nurse_assignments_made', on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Assigned {self.assigned_nurse} to {self.patient} by {self.assigned_by} on {self.timestamp}'