from rest_framework import serializers
from .models import (
    Volunteer, ForumPost, ForumComment, ContactMessage,
    Project, DivisionChampion, XPActivity, TimeCommitment
)


class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

    def validate_email(self, value):
        if self.instance is None:  # Creating new volunteer
            if Volunteer.objects.filter(email=value).exists():
                raise serializers.ValidationError("A volunteer with this email already exists")
        return value


class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class ForumCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumComment
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

    def validate_post(self, value):
        if not ForumPost.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Post not found")
        return value


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'volunteers_registered')


class DivisionChampionSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.first_name', read_only=True)
    division_display = serializers.CharField(source='get_division_display', read_only=True)
    
    class Meta:
        model = DivisionChampion
        fields = '__all__'
        read_only_fields = ('id', 'appointed_at')


class XPActivitySerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.first_name', read_only=True)
    activity_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = XPActivity
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class TimeCommitmentSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.first_name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = TimeCommitment
        fields = '__all__'
        read_only_fields = ('id', 'pledge_date')