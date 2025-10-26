from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import (
    Volunteer, ForumPost, ForumComment, ContactMessage,
    Project, DivisionChampion, XPActivity, TimeCommitment
)
from .serializers import (
    VolunteerSerializer, ForumPostSerializer, ForumCommentSerializer, ContactMessageSerializer,
    ProjectSerializer, DivisionChampionSerializer, XPActivitySerializer, TimeCommitmentSerializer
)


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            volunteer = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForumPostViewSet(viewsets.ModelViewSet):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer

    def get_queryset(self):
        queryset = ForumPost.objects.all()
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        return queryset

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get comments for a specific post"""
        try:
            post = self.get_object()
            comments = ForumComment.objects.filter(post=post)
            serializer = ForumCommentSerializer(comments, many=True)
            return Response(serializer.data)
        except ForumPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)


class ForumCommentViewSet(viewsets.ModelViewSet):
    queryset = ForumComment.objects.all()
    serializer_class = ForumCommentSerializer

    def create(self, request, *args, **kwargs):
        # Handle post_id from request data
        data = request.data.copy()
        if 'postId' in data:
            try:
                post = ForumPost.objects.get(id=data['postId'])
                data['post'] = post.id
                del data['postId']
            except ForumPost.DoesNotExist:
                return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            comment = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        division = self.request.query_params.get('division', None)
        location = self.request.query_params.get('location', None)
        status_filter = self.request.query_params.get('status', None)
        
        if division:
            queryset = queryset.filter(division=division)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-created_at')

    @action(detail=True, methods=['post'])
    def join_project(self, request, pk=None):
        """Allow volunteer to join a project and create time commitment"""
        try:
            project = self.get_object()
            volunteer_email = request.data.get('volunteer_email')
            hours_pledged = request.data.get('hours_pledged', 1)
            
            if not volunteer_email:
                return Response({'error': 'Volunteer email required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                volunteer = Volunteer.objects.get(email=volunteer_email)
            except Volunteer.DoesNotExist:
                return Response({'error': 'Volunteer not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Create time commitment
            commitment = TimeCommitment.objects.create(
                volunteer=volunteer,
                project=project,
                hours_pledged=hours_pledged
            )
            
            # Award XP for joining project
            XPActivity.objects.create(
                volunteer=volunteer,
                activity_type='project_signup',
                xp_earned=5,
                description=f"Joined project: {project.title}",
                project=project
            )
            
            # Update project volunteer count
            project.volunteers_registered += 1
            project.save()
            
            return Response({
                'message': 'Successfully joined project',
                'commitment_id': commitment.id,
                'xp_earned': 5
            }, status=status.HTTP_201_CREATED)
            
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)


class DivisionChampionViewSet(viewsets.ModelViewSet):
    queryset = DivisionChampion.objects.all()
    serializer_class = DivisionChampionSerializer

    def get_queryset(self):
        queryset = DivisionChampion.objects.filter(is_active=True)
        division = self.request.query_params.get('division', None)
        if division:
            queryset = queryset.filter(division=division)
        return queryset


class XPActivityViewSet(viewsets.ModelViewSet):
    queryset = XPActivity.objects.all()
    serializer_class = XPActivitySerializer

    def get_queryset(self):
        queryset = XPActivity.objects.all()
        volunteer_email = self.request.query_params.get('volunteer_email', None)
        if volunteer_email:
            queryset = queryset.filter(volunteer__email=volunteer_email)
        return queryset.order_by('-created_at')


class TimeCommitmentViewSet(viewsets.ModelViewSet):
    queryset = TimeCommitment.objects.all()
    serializer_class = TimeCommitmentSerializer

    @action(detail=True, methods=['post'])
    def verify_hours(self, request, pk=None):
        """Allow project leaders to verify completed hours"""
        try:
            commitment = self.get_object()
            verifier_name = request.data.get('verifier_name')
            hours_completed = request.data.get('hours_completed')
            
            if not verifier_name or hours_completed is None:
                return Response({
                    'error': 'Verifier name and hours completed required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            commitment.hours_completed = hours_completed
            commitment.completion_verified_by = verifier_name
            commitment.is_verified = True
            commitment.save()
            
            # Award XP for completed volunteer hours
            xp_earned = hours_completed * 10  # 10 XP per hour
            XPActivity.objects.create(
                volunteer=commitment.volunteer,
                activity_type='volunteer_hours',
                xp_earned=xp_earned,
                description=f"Completed {hours_completed} hours for {commitment.project.title}",
                project=commitment.project
            )
            
            return Response({
                'message': 'Hours verified successfully',
                'xp_earned': xp_earned
            }, status=status.HTTP_200_OK)
            
        except TimeCommitment.DoesNotExist:
            return Response({'error': 'Time commitment not found'}, status=status.HTTP_404_NOT_FOUND)