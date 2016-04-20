from django.conf.urls import include, url
from django.contrib import admin

from forum.views import *

urlpatterns = [
    url(r'^forum$', Forum.as_view()),

]
