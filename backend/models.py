from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
# Create your models here.

class UniSizeGroup(models.Model):
    SIZE_GROUPS = {
        0: 'small',
        1: 'medium',
        2: 'large',
        3: 'huge'
    }

    group = models.SmallIntegerField(default=1)

    def size_group(self, text):
        return [n for (n, t) in self.SIZE_GROUPS if t == text][0]

    def __str__(self):
        return self.SIZE_GROUPS[self.group] + ' universities'

class University(models.Model):
    name = models.CharField(max_length=200, default="")
    description = models.TextField(default="")
    state = models.CharField(max_length=80, default="TX")
    city = models.CharField(max_length=80, default="Cut and Shoot")
    population = models.IntegerField(default=0)
    size_group = models.ForeignKey(UniSizeGroup, related_name='unis', blank=True, null=True)
    logo = models.FileField(upload_to="uni_logos/", default="uni_logos/default_univ.jpg")
    is_staging = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=200, default="No phone number", blank=True, null=True)

    def __str__(self):
        return self.name

class UniFiles(models.Model):
    university = models.ForeignKey(University, related_name="files")
    name = models.CharField(max_length=200, default="")
    description = models.TextField(default="")
    uploaded_file = models.FileField(upload_to="uni_files/", blank=True, null=True)
    link = models.CharField(max_length=300, default="", blank=True, null=True)
    ordering = models.IntegerField(default=0, blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class UniKeyTerms(models.Model):
    university = models.ForeignKey(University, related_name="key_terms")
    term = models.CharField(max_length=200, default="")
    definition = models.TextField(default="")

class CustomUser(models.Model):
    name = models.CharField(max_length=100, default="")
    bio = models.TextField(default="", blank=True, null=True)
    new_user = models.BooleanField(default=True)
    ordering = models.IntegerField(default=0, blank=True)
    position = models.CharField(max_length=200, default="")
    # role can either be collaborator, admin, or requested
    # --admin: can manage roles, use form, upload resources
    # --collaborator: can use form, upload resources
    # --requested: no permissions
    role = models.CharField(max_length=200, default="")
    university = models.ForeignKey(University, related_name="members")
    user = models.OneToOneField(settings.AUTH_USER_MODEL, default=0, related_name="customuser")
    email = models.CharField(max_length=100, default="", blank=True, null=True)
    phone_number = models.CharField(max_length=100, default="", blank=True, null=True)

    def __str__(self):
        return self.name

class ProfileCategory(models.Model):
    name = models.CharField(max_length=200, default="")
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class ProfileSubcategory(models.Model):
    category = models.ForeignKey(ProfileCategory, related_name="subcategories")
    name = models.CharField(max_length=200, default="")
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class FilledCategory(models.Model):
    category = models.ForeignKey(ProfileCategory, related_name="filled_forms")
    university = models.ForeignKey(University, related_name="form_categories")

class FilledSubcategory(models.Model):
    filled_category = models.ForeignKey(FilledCategory, related_name="filled_subcategories")
    name = models.CharField(max_length=200, default="")
    is_offered = models.BooleanField(default=False)
    description = models.TextField(default="")

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.name

class PublicPost(models.Model):
    title = models.CharField(max_length=500, default="")
    creator = models.ForeignKey(CustomUser, blank=True, null=True, related_name="public_posts")
    content = models.TextField(default="")
    timestamp = models.DateTimeField(default=timezone.now)
    tags = models.ManyToManyField(Tag, related_name="public_posts")
    is_anonymous = models.BooleanField(default=True)
    creator_name = models.CharField(max_length=80, default="")

class PublicResponse(models.Model):
    creator = models.ForeignKey(CustomUser, blank=True, null=True, related_name="public_responses")
    timestamp = models.DateTimeField(default=timezone.now)
    content = models.TextField(default="")
    is_anonymous = models.BooleanField(default=True)
    creator_name = models.CharField(max_length=80, default="")

class PublicLike(models.Model):
    user = models.ForeignKey(CustomUser, related_name="public_post_likes")
    post = models.ForeignKey(PublicPost, related_name="likes")

class PrivatePost(models.Model):
    title = models.CharField(max_length=500, default="")
    creator = models.ForeignKey(CustomUser, related_name="private_posts")
    content = models.TextField(default="")
    timestamp = models.DateTimeField(default=timezone.now)
    tags = models.ManyToManyField(Tag, related_name="private_posts")

class PrivateResponse(models.Model):
    creator = models.ForeignKey(CustomUser, blank=True, null=True, related_name="private_responses")
    timestamp = models.DateTimeField(default=timezone.now)
    content = models.TextField(default="")

class PrivateLike(models.Model):
    user = models.ForeignKey(CustomUser, related_name="private_post_likes")
    post = models.ForeignKey(PrivatePost, related_name="likes")



