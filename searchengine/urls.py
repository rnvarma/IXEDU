from django.conf.urls import include, url

from searchengine.views import *

urlpatterns = [
    url(r'^search$', SearchPage.as_view()),
    url(r'^allunis$', AllUniversities.as_view())
]
