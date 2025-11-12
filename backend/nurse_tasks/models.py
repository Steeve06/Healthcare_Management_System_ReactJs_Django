from django.db import models
from accounts.models import User
from patients.models import Patient

class NurseTask(models.Model):
    nurse = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'nurse'})
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    scheduled_time = models.TimeField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['scheduled_time']

    def __str__(self):
        return f'{self.title} for {self.patient} by {self.nurse}'