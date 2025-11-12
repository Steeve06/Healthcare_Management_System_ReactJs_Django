from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from patients.models import Patient
from django.contrib.auth import get_user_model

User = get_user_model()

class PatientSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Patient
        fields = [
            'first_name', 'last_name', 'date_of_birth', 'gender', 'blood_group',
            'email', 'phone', 'address', 'city', 'state', 'zip_code',
            'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
            'allergies', 'chronic_conditions', 'current_medications', 'password'
        ]

    def create(self, validated_data):
        # Pop password for User creation
        password = validated_data.pop('password')
        email = validated_data.get('email')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        
        # Create User object (if Patient relates to User)
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Create Patient object with remaining validated data + user
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'profile_picture', 'first_name', 'last_name']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
