from rest_framework.routers import DefaultRouter
from .views import NurseTaskViewSet

router = DefaultRouter()
router.register(r'tasks', NurseTaskViewSet)

urlpatterns = router.urls
