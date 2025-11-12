from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import NurseTask
from .serializers import NurseTaskSerializer

class NurseTaskViewSet(viewsets.ModelViewSet):
    queryset = NurseTask.objects.all()
    serializer_class = NurseTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='my-tasks')
    def my_tasks(self, request):
        # Only nurses can use this endpoint
        if request.user.role != 'nurse':
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        tasks = self.get_queryset().filter(nurse=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
