from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from community.models import ForumPost, ForumComment
import uuid


class Command(BaseCommand):
    help = 'Set up initial data including superuser and sample forum posts'

    def handle(self, *args, **options):
        # Create superuser
        username = 'rion'
        password = 'Backdoorlockpin!'
        email = 'rion@atlasunite.org'
        
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, email, password)
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created superuser: {username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Superuser {username} already exists')
            )

        # Create sample forum posts
        sample_posts = [
            {
                'title': "Creek Cleanup at Kedron Brook - Need More Volunteers!",
                'content': "Hey everyone! We're organizing a creek cleanup at Kedron Brook this Saturday and could use more hands. It's going to be a big area to cover and we want to make sure we can clean as much as possible. The event starts at 8 AM and we'll provide all the equipment needed. Please bring sunscreen, water, and closed-toe shoes. Looking forward to seeing you there!",
                'author': "Sarah Johnson",
                'category': "Project Coordination",
                'created_at': datetime.now() - timedelta(hours=2),
            },
            {
                'title': "New Community Garden Success in Paddington!",
                'content': "Amazing news! The community garden we started in Paddington is thriving. Check out these photos from this week's harvest - we've got tomatoes, herbs, lettuce, and so much more growing beautifully. The local community has really embraced the project and we're seeing families come together to tend to the plots. Thank you to everyone who helped make this happen!",
                'author': "Mike Chen",
                'category': "Success Stories",
                'created_at': datetime.now() - timedelta(hours=4),
            },
            {
                'title': "Idea: Mobile Tool Library for Projects",
                'content': "What if we created a mobile tool library that could rotate between project sites? This could help reduce barriers to participation and ensure everyone has access to the equipment they need. We could start small with basic gardening tools and cleaning supplies, then expand based on community needs. Has anyone worked on something like this before? Would love to hear thoughts and ideas!",
                'author': "Alex Liu",
                'category': "Ideas & Suggestions",
                'created_at': datetime.now() - timedelta(days=1),
            },
            {
                'title': "Best Plants for Habitat Restoration?",
                'content': "I'm new to habitat restoration and wondering what native plants work best for the Brisbane climate. We're looking at a site in the northern suburbs that gets partial sun throughout the day. I've heard eucalyptus varieties are good but want to make sure we're choosing plants that will actually thrive and provide good habitat for local wildlife. Any recommendations from experienced volunteers?",
                'author': "Rachel Martinez",
                'category': "Project Coordination",
                'created_at': datetime.now() - timedelta(days=2),
            },
        ]

        for post_data in sample_posts:
            if not ForumPost.objects.filter(title=post_data['title']).exists():
                post = ForumPost.objects.create(**post_data)
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created forum post: {post.title}')
                )

        # Create sample comments
        posts = ForumPost.objects.all()
        if posts.exists():
            first_post = posts.first()
            
            sample_comments = [
                {
                    'post': first_post,
                    'content': "I'll be there! Should we bring our own gloves or will those be provided too?",
                    'author': "Emma Davis",
                    'created_at': datetime.now() - timedelta(hours=1),
                },
                {
                    'post': first_post,
                    'content': "Count me in! I can bring my pickup truck if we need help transporting collected debris.",
                    'author': "James Wilson",
                    'created_at': datetime.now() - timedelta(minutes=30),
                },
            ]

            for comment_data in sample_comments:
                if not ForumComment.objects.filter(
                    post=comment_data['post'], 
                    author=comment_data['author']
                ).exists():
                    comment = ForumComment.objects.create(**comment_data)
                    self.stdout.write(
                        self.style.SUCCESS(f'Successfully created comment by: {comment.author}')
                    )

        self.stdout.write(self.style.SUCCESS('Initial data setup completed successfully!'))