from rest_framework import serializers
from .models import Patient, MedicalRecord
from accounts.serializers import UserSerializer

class PatientSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['patient_id', 'registered_date', 'updated_at', 'age', 'full_name', 'user']  # Added 'user'

class PatientListSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Patient
        fields = ['id', 'patient_id', 'full_name', 'email', 'phone', 'age', 'blood_group', 'is_active']


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = MedicalRecord
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
