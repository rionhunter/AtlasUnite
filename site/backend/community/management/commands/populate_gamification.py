from django.core.management.base import BaseCommand
from community.models import (
    Volunteer, Project, DivisionChampion, XPActivity, TimeCommitment
)
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate database with sample gamification data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample projects and gamification data...')
        
        # Create sample projects
        projects_data = [
            {
                'title': 'Creek Restoration at South Bank',
                'description': 'Help restore native vegetation along the Brisbane River at South Bank. We need volunteers to plant native grasses, remove weeds, and create habitat for local wildlife. Perfect for beginners with guidance from experienced restoration specialists.',
                'division': 'habitat_restoration',
                'location': 'South Bank, Brisbane',
                'coordinator': 'Emma Martinez',
                'status': 'recruiting',
                'volunteers_needed': 15,
                'volunteers_registered': 3,
                'xp_reward': 25,
            },
            {
                'title': 'New Farm Community Kitchen Setup',
                'description': 'Establish a community kitchen in New Farm to support local food security initiatives. Tasks include equipment installation, organizing supplies, and creating operational procedures. Great for volunteers with construction or organizational skills.',
                'division': 'locals_unite',
                'location': 'New Farm, Brisbane',
                'coordinator': 'James Wilson',
                'status': 'active',
                'volunteers_needed': 8,
                'volunteers_registered': 6,
                'xp_reward': 30,
            },
            {
                'title': 'Wynnum Mangrove Educational Walk Setup',
                'description': 'Create educational signage and prepare walking trails through the Wynnum mangrove area. We need volunteers to help with sign installation, trail maintenance, and initial guided tour training.',
                'division': 'education',
                'location': 'Wynnum, Brisbane',
                'coordinator': 'Sarah Chen',
                'status': 'planning',
                'volunteers_needed': 12,
                'volunteers_registered': 1,
                'xp_reward': 20,
            },
            {
                'title': 'Paddington Community Newsletter Launch',
                'description': 'Launch a quarterly community newsletter for Paddington residents. Tasks include content creation, design, distribution planning, and community engagement. Ideal for volunteers with writing, design, or marketing experience.',
                'division': 'atlas_ink',
                'location': 'Paddington, Brisbane',
                'coordinator': 'Michael Davis',
                'status': 'recruiting',
                'volunteers_needed': 5,
                'volunteers_registered': 2,
                'xp_reward': 15,
            },
            {
                'title': 'Kelvin Grove School Garden Expansion',
                'description': 'Expand the existing school garden at Kelvin Grove State College to include native plant sections and composting areas. Volunteers will work with students and teachers to design and implement sustainable gardening practices.',
                'division': 'community_garden',
                'location': 'Kelvin Grove, Brisbane',
                'coordinator': 'Lisa Thompson',
                'status': 'active',
                'volunteers_needed': 10,
                'volunteers_registered': 8,
                'xp_reward': 35,
            }
        ]
        
        created_projects = []
        for project_data in projects_data:
            project, created = Project.objects.get_or_create(
                title=project_data['title'],
                defaults=project_data
            )
            created_projects.append(project)
            if created:
                self.stdout.write(f'Created project: {project.title}')
        
        # Create sample volunteers with XP and levels
        volunteers_data = [
            {
                'first_name': 'Alex',
                'last_name': 'Johnson',
                'email': 'alex.johnson@example.com',
                'suburb': 'West End',
                'interests': ['habitat_restoration', 'community_garden'],
                'xp_points': 245,
                'time_pledged_hours': 15,
                'time_completed_hours': 12,
            },
            {
                'first_name': 'Maria',
                'last_name': 'Rodriguez',
                'email': 'maria.rodriguez@example.com',
                'suburb': 'New Farm',
                'interests': ['locals_unite', 'education'],
                'xp_points': 580,
                'time_pledged_hours': 25,
                'time_completed_hours': 23,
            },
            {
                'first_name': 'David',
                'last_name': 'Kim',
                'email': 'david.kim@example.com',
                'suburb': 'Paddington',
                'interests': ['atlas_ink', 'charity_support'],
                'xp_points': 125,
                'time_pledged_hours': 8,
                'time_completed_hours': 8,
            }
        ]
        
        created_volunteers = []
        for vol_data in volunteers_data:
            volunteer, created = Volunteer.objects.get_or_create(
                email=vol_data['email'],
                defaults=vol_data
            )
            created_volunteers.append(volunteer)
            if created:
                self.stdout.write(f'Created volunteer: {volunteer.first_name} {volunteer.last_name}')
        
        # Create Division Champions
        if created_volunteers:
            champion_assignments = [
                {'volunteer': created_volunteers[0], 'division': 'habitat_restoration'},
                {'volunteer': created_volunteers[1], 'division': 'locals_unite'},
                {'volunteer': created_volunteers[2], 'division': 'atlas_ink'},
            ]
            
            for assignment in champion_assignments:
                champion, created = DivisionChampion.objects.get_or_create(
                    volunteer=assignment['volunteer'],
                    division=assignment['division']
                )
                if created:
                    self.stdout.write(f'Appointed {champion.volunteer.first_name} as {champion.get_division_display()} Champion')
        
        # Create sample XP activities
        if created_volunteers and created_projects:
            xp_activities = [
                {
                    'volunteer': created_volunteers[0],
                    'activity_type': 'project_signup',
                    'xp_earned': 5,
                    'description': f'Joined project: {created_projects[0].title}',
                    'project': created_projects[0],
                },
                {
                    'volunteer': created_volunteers[0],
                    'activity_type': 'volunteer_hours',
                    'xp_earned': 120,
                    'description': 'Completed 12 hours of habitat restoration work',
                    'project': created_projects[0],
                },
                {
                    'volunteer': created_volunteers[1],
                    'activity_type': 'project_completion',
                    'xp_earned': 50,
                    'description': f'Completed project: {created_projects[1].title}',
                    'project': created_projects[1],
                },
                {
                    'volunteer': created_volunteers[2],
                    'activity_type': 'forum_post',
                    'xp_earned': 10,
                    'description': 'Created helpful forum post about community engagement',
                },
            ]
            
            for activity_data in xp_activities:
                # Check if similar activity already exists to avoid duplicates
                existing = XPActivity.objects.filter(
                    volunteer=activity_data['volunteer'],
                    activity_type=activity_data['activity_type'],
                    description=activity_data['description']
                ).first()
                
                if not existing:
                    XPActivity.objects.create(**activity_data)
                    self.stdout.write(f'Created XP activity: {activity_data["description"]}')
        
        # Create time commitments
        if created_volunteers and created_projects:
            commitments = [
                {
                    'volunteer': created_volunteers[0],
                    'project': created_projects[0],
                    'hours_pledged': 15,
                    'hours_completed': 12,
                    'is_verified': True,
                    'completion_verified_by': 'Emma Martinez',
                },
                {
                    'volunteer': created_volunteers[1],
                    'project': created_projects[1],
                    'hours_pledged': 20,
                    'hours_completed': 18,
                    'is_verified': True,
                    'completion_verified_by': 'James Wilson',
                },
                {
                    'volunteer': created_volunteers[2],
                    'project': created_projects[3],
                    'hours_pledged': 8,
                    'hours_completed': 8,
                    'is_verified': True,
                    'completion_verified_by': 'Michael Davis',
                },
            ]
            
            for commitment_data in commitments:
                commitment, created = TimeCommitment.objects.get_or_create(
                    volunteer=commitment_data['volunteer'],
                    project=commitment_data['project'],
                    defaults=commitment_data
                )
                if created:
                    self.stdout.write(f'Created time commitment: {commitment}')
        
        self.stdout.write(self.style.SUCCESS('Successfully populated gamification data!'))
        self.stdout.write(f'Created {len(created_projects)} projects')
        self.stdout.write(f'Created {len(created_volunteers)} volunteers with XP levels')
        self.stdout.write('Ready to demonstrate gamification features!')