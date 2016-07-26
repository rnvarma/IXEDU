from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.conf import settings

from backend.models import *

from urllib import quote, unquote, urlencode
import base64
import hmac
import hashlib

# Create your views here.

class HomePage(View):
    def get(self, request):
        context = {}
        if not request.user.is_anonymous():
            context["uni"] = request.user.customuser.university
        return render(request, 'home.html', context)

class WelcomePage(View):
    def get(self, request):
        return render(request, "welcome.html")

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

class ForumLogin(View):
    def get(self, request):
        SSO_SECRET = 'lgH2uV9TZCnty1Toxfa8zkKJ5gpoXS6qIY3cOmxjeZuwCilcYc'

        sso_payload = request.GET.get('sso')
        sig = request.GET.get('sig')

        nonce = base64.decodestring(unquote(sso_payload))
        nonce = nonce[6:nonce.find('&')]

        signature = hmac.new(SSO_SECRET, msg=sso_payload, digestmod=hashlib.sha256).hexdigest()

        if (signature != sig):
            return HttpResponseRedirect("/")

        if not request.user.is_anonymous():
            data = {
                'nonce': nonce,
                'email': request.user.customuser.email,
                'external_id': request.user.id,
                'username': request.user.customuser.name,
                'name': request.user.customuser.name,
                'avatar_url': settings.MEDIA_URL + str(request.user.customuser.thumbnail),
                'about_me': request.user.customuser.bio
            }
            data_qstring = urlencode(data)

            return_payload = base64.encodestring(data_qstring)
            return_signature = \
              hmac.new(SSO_SECRET, return_payload, digestmod=hashlib.sha256).hexdigest()

            return HttpResponseRedirect(
                "http://forum.ixedu.org/session/sso_login?sso=" + \
                return_payload + "&sig=" + return_signature
            )
        else:
            request.session['forum_info'] = 'sso=' + sso_payload + '&sig=' + sig
            return HttpResponseRedirect('/login?next=forum')

class Login(View):
    def get(self, request):
        context = {}
        if not request.user.is_anonymous():
            context['uni'] = request.user.customuser.university
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
                if redirect == 'forum':
                    return HttpResponseRedirect('/forumlogin?' + request.session.get('forum_info', 'none'))
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





