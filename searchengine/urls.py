from django.conf.urls import include, url

from searchengine.views import *

urlpatterns = [
    url(r'^search$', AllUniversities.as_view()),
    url(r'^allunis$', AllUniversities.as_view())
]
