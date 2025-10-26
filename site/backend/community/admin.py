from django.contrib import admin
from .models import Volunteer, ForumPost, ForumComment, ContactMessage


@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'suburb', 'created_at')
    list_filter = ('created_at', 'suburb', 'consent', 'newsletter')
    search_fields = ('first_name', 'last_name', 'email', 'suburb')
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'suburb')
        }),
        ('Volunteering Details', {
            'fields': ('interests', 'availability', 'experience')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_name', 'emergency_phone')
        }),
        ('Permissions', {
            'fields': ('consent', 'newsletter')
        }),
        ('System Information', {
            'fields': ('id', 'created_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'author', 'content')
    readonly_fields = ('id', 'created_at')


@admin.register(ForumComment)
class ForumCommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('author', 'content', 'post__title')
    readonly_fields = ('id', 'created_at')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'subject', 'created_at')
    list_filter = ('subject', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'subject')
    readonly_fields = ('id', 'created_at')
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Message Details', {
            'fields': ('subject', 'message')
        }),
        ('System Information', {
            'fields': ('id', 'created_at'),
            'classes': ('collapse',)
        }),
    )