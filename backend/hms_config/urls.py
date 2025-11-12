from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('patients.urls')),
    path('api/', include('appointments.urls')),
    path('api/nurse-tasks/', include('nurse_tasks.urls')),

# Add more app URLs as you build them
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
