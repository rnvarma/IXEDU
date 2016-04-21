
from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
# Create your models here.

class forummodel(models.Model):
    title=models.CharField(max_length=100)
    inquiry=models.TextField()
    tags=models.CharField(max_length=120)  
    def __unicode__(self):   ### python 2.7
        return self.title 
        
class PublicPost(models.Model):
    title=models.CharField(max_length=500, default="")
    content=models.TextField(default="")
    timestamp= models.DateTimeField(default=timezone.now)
    is_anonymous=models.BooleanField(default=True) 
    creator_name= models.CharField(max_length=80, default="")

class PrivatePost(models.Model):
    title = models.CharField(max_length=500, default="")
    content=models.TextField(default="")
    is_anonyous=models.BooleanField(default=True)
    timestmp= models.DateTimeField(default=timezone.now)
    creator_name= models.CharField(max_length=80, default="")

class CustomUser(models.Model):
    name = models.CharField(max_length=100, default="")
    bio = models.TextField(default="", blank = True, null = True)
    position = models.CharField(max_length=200, default="")
    email= models.CharField(max_length=100, default="", blank=True, null =True)
    
    def __str__(self):
        return self.name 
