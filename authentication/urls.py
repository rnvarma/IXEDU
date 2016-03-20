from django.conf.urls import include, url

from authentication.views import *

urlpatterns = [
    url(r'^$', HomePage.as_view()),
]
