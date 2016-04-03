from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User

from backend.models import *

# Create your views here.
class Forum(View):
    def get(self, request):
        template= "forum.html"
        form = BlogPosts(request.POST or None)
        if form.is_valid():
            variable = form.save(commit='false')
            variable.save()
        context = {}
        return render(request, template, context)

