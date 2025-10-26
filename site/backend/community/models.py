from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Volunteer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    suburb = models.CharField(max_length=100, blank=True, null=True)
    interests = models.JSONField(default=list, blank=True)
    availability = models.JSONField(default=list, blank=True)
    experience = models.TextField(blank=True, null=True)
    emergency_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_phone = models.CharField(max_length=20, blank=True, null=True)
    consent = models.BooleanField(default=False)
    newsletter = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Gamification fields
    xp_points = models.PositiveIntegerField(default=0)
    division_level = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(10)])
    
    # Time Trust Contract fields
    time_pledged_hours = models.PositiveIntegerField(default=0, help_text="Hours pledged for volunteer work")
    time_completed_hours = models.PositiveIntegerField(default=0, help_text="Hours actually completed")
    reliability_score = models.FloatField(default=100.0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    verified_volunteer = models.BooleanField(default=False, help_text="Time tracking verified by project leaders")

    def calculate_division_level(self):
        """Calculate division level based on XP points"""
        if self.xp_points >= 10000:
            return 10
        elif self.xp_points >= 5000:
            return 9
        elif self.xp_points >= 2500:
            return 8
        elif self.xp_points >= 1000:
            return 7
        elif self.xp_points >= 500:
            return 6
        elif self.xp_points >= 250:
            return 5
        elif self.xp_points >= 100:
            return 4
        elif self.xp_points >= 50:
            return 3
        elif self.xp_points >= 25:
            return 2
        else:
            return 1
    
    def calculate_reliability_score(self):
        """Calculate reliability score based on pledged vs completed hours"""
        if self.time_pledged_hours == 0:
            return 100.0
        completion_rate = (self.time_completed_hours / self.time_pledged_hours) * 100
        return min(completion_rate, 100.0)
    
    def save(self, *args, **kwargs):
        self.division_level = self.calculate_division_level()
        self.reliability_score = self.calculate_reliability_score()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['-created_at']


class ForumPost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class ForumComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    author = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment on {self.post.title} by {self.author}"

    class Meta:
        ordering = ['created_at']


class ContactMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.first_name} {self.last_name}"

    class Meta:
        ordering = ['-created_at']


class Project(models.Model):
    """Community projects with location-based organization"""
    DIVISION_CHOICES = [
        ('locals_unite', 'Locals Unite'),
        ('atlas_ink', 'Atlas Ink'),
        ('community_garden', 'Community Gardens'),
        ('habitat_restoration', 'Habitat Restoration'),
        ('charity_support', 'Charity Support'),
        ('education', 'Education & Workshops'),
    ]
    
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('recruiting', 'Recruiting Volunteers'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    division = models.CharField(max_length=50, choices=DIVISION_CHOICES)
    location = models.CharField(max_length=200, help_text="Suburb or specific location in Brisbane")
    coordinator = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    volunteers_needed = models.PositiveIntegerField(default=1)
    volunteers_registered = models.PositiveIntegerField(default=0)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    xp_reward = models.PositiveIntegerField(default=10, help_text="XP points awarded for participation")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.location}"
    
    class Meta:
        ordering = ['-created_at']


class DivisionChampion(models.Model):
    """Trusted community leaders for each division"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='champion_roles')
    division = models.CharField(max_length=50, choices=Project.DIVISION_CHOICES)
    appointed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.volunteer.first_name} {self.volunteer.last_name} - {self.get_division_display()} Champion"
    
    class Meta:
        unique_together = ['volunteer', 'division']
        ordering = ['-appointed_at']


class XPActivity(models.Model):
    """Track XP-earning activities for immediate feedback"""
    ACTIVITY_TYPES = [
        ('project_signup', 'Project Sign-up'),
        ('project_completion', 'Project Completion'),
        ('forum_post', 'Forum Post'),
        ('forum_comment', 'Forum Comment'),
        ('volunteer_hours', 'Volunteer Hours Logged'),
        ('community_vote', 'Community Vote'),
        ('mentor_activity', 'Mentoring Activity'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='xp_activities')
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    xp_earned = models.PositiveIntegerField()
    description = models.CharField(max_length=200)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        # Add XP to volunteer when activity is created
        super().save(*args, **kwargs)
        if self.volunteer:
            self.volunteer.xp_points += self.xp_earned
            self.volunteer.save()
    
    def __str__(self):
        return f"{self.volunteer} earned {self.xp_earned} XP for {self.get_activity_type_display()}"
    
    class Meta:
        ordering = ['-created_at']


class TimeCommitment(models.Model):
    """Track time pledges and actual completion for trust building"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='time_commitments')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='time_commitments')
    hours_pledged = models.PositiveIntegerField()
    hours_completed = models.PositiveIntegerField(default=0)
    pledge_date = models.DateTimeField(auto_now_add=True)
    completion_verified_by = models.CharField(max_length=100, blank=True, null=True, help_text="Project leader who verified hours")
    is_verified = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update volunteer's total pledged and completed hours
        self.volunteer.time_pledged_hours = sum(
            commitment.hours_pledged for commitment in self.volunteer.time_commitments.all()
        )
        self.volunteer.time_completed_hours = sum(
            commitment.hours_completed for commitment in self.volunteer.time_commitments.all()
        )
        self.volunteer.save()
    
    def __str__(self):
        return f"{self.volunteer} pledged {self.hours_pledged}h for {self.project.title}"
    
    class Meta:
        ordering = ['-pledge_date']