from django.contrib import admin
from .models import NurseTask

@admin.register(NurseTask)
class NurseTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'nurse', 'patient', 'scheduled_time', 'completed']
    list_filter = ['nurse', 'completed']
    search_fields = ['title', 'patient__first_name', 'patient__last_name']
