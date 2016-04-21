from django import forms 
from django.forms import ModelForm

from .models import *

class forumform(ModelForm):
    class Meta:
        model = forummodel
        #fields= ['title','context','after','initial']
        exclude= ['']