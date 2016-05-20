from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User

from backend.models import *

# Create your views here.

class HomePage(View):
    def get(self, request):
        context = {}
        if not request.user.is_anonymous():
            context["uni"] = request.user.customuser.university
        return render(request, 'home.html', context)


class Register(View):
    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        new_user = User.objects.create_user(request.POST.get('username'),
            request.POST.get('email'), request.POST.get('password'))
        new_user.first_name = request.POST.get('first_name')
        new_user.last_name = request.POST.get('last_name')
        new_user.save()

        full_name = request.POST.get('first_name') + " " + request.POST.get('last_name')
        university, created = University.objects.get_or_create(name=request.POST.get('uni'))

        cu = CustomUser(name=full_name, university=university, user=new_user, email=request.POST.get('email'))
        cu.save()
        user = authenticate(username=request.POST.get('username'), password=request.POST.get('password'))
        if user is not None:
            login(request, user)
            return HttpResponseRedirect("/")
        else:
            return HttpResponseRedirect("/login")

class Login(View):
    def get(self, request):
        context = {}
        if request.GET.get('next') is not None:
            context['next'] = request.GET.get('next')
        return render(request, 'login.html', context=context)

    def post(self, request):
        user = authenticate(username=request.POST.get('username'),
                            password=request.POST.get('password'))
        if user is not None:
            login(request, user)
            redirect = request.POST.get('next')
            if not redirect == u'':
                return HttpResponseRedirect(redirect)
            if user.customuser.new_user:
                user.customuser.new_user = False
                user.customuser.save()
                return HttpResponseRedirect("/change-password")
            return HttpResponseRedirect("/")
        else:
            return HttpResponseRedirect("/login")

class Logout(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect("/login")

class UserPage(View):
    def get(self, request):
        context = {}
        context["uni"] = request.user.customuser.university
        return render(request, 'user.html', context)





