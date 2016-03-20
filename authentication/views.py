from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
# Create your views here.

class HomePage(View):
    def get(self, request):
        return render(request, 'home.html')