from django.conf.urls import include, url
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views

from authentication.views import *

urlpatterns = [
    url(r'^$', HomePage.as_view()),
    url(r'^welcome$', WelcomePage.as_view()),
    url(r'^login$', Login.as_view()),
    url(r'^logout$', Logout.as_view()),
    url(r'^register$', Register.as_view()),
    url(r'^user$', login_required(UserPage.as_view())),
    url(r'^change-password$', auth_views.password_change,
        {
            'template_name': 'change_password.html',
            'post_change_redirect': '/'
        }),
    url(r'^logout-then-login$', auth_views.logout_then_login)
]
