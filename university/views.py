from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect

from backend.models import *
# Create your views here.

class UniversityProfile(View):
    def get(self, request, u_id):
        context = {}
        context["uni"] = University.objects.get(id=u_id)
        return render(request, 'university_profile.html', context)