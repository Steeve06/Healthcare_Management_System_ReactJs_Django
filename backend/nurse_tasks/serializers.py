from rest_framework import serializers
from .models import NurseTask

class NurseTaskSerializer(serializers.ModelSerializer):
    nurse_name = serializers.CharField(source='nurse.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = NurseTask
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'nurse_name', 'patient_name']
