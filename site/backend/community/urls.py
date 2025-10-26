from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VolunteerViewSet, ForumPostViewSet, ForumCommentViewSet, ContactMessageViewSet,
    ProjectViewSet, DivisionChampionViewSet, XPActivityViewSet, TimeCommitmentViewSet
)

router = DefaultRouter()
router.register(r'volunteers', VolunteerViewSet)
router.register(r'forum/posts', ForumPostViewSet, basename='forumpost')
router.register(r'forum/comments', ForumCommentViewSet)
router.register(r'contact', ContactMessageViewSet, basename='contactmessage')
router.register(r'projects', ProjectViewSet)
router.register(r'champions', DivisionChampionViewSet)
router.register(r'xp-activities', XPActivityViewSet)
router.register(r'time-commitments', TimeCommitmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Custom URL for post comments to match frontend expectations
    path('forum/posts/<uuid:pk>/comments/', ForumPostViewSet.as_view({'get': 'comments'}), name='post-comments'),
]