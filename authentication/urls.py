from django.conf.urls import include, url
from django.contrib.auth.decorators import login_required

from authentication.views import *

urlpatterns = [
    url(r'^$', HomePage.as_view()),
    url(r'^login$', Login.as_view()),
    url(r'^register$', Register.as_view()),
    url(r'^user$', UserPage.as_view())
]
