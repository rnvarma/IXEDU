from django.conf.urls import include, url
from django.views.decorators.csrf import ensure_csrf_cookie, requires_csrf_token

from university.views import *

urlpatterns = [
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)$', UniversityProfile.as_view()),
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)/form$', UniversityForm.as_view()),
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)/editresources',
        ensure_csrf_cookie(UniversityEditResources.as_view())),
    url(r'^removeresource',
        requires_csrf_token(UniversityRemoveResources.as_view())),
    url(r'^addresource',
        requires_csrf_token(UniversityAddResources.as_view())),
    url(r'^uploadphoto$', UniversityPhoto.as_view()),
    url(r'^editmetadata$', UniversityMetaData.as_view())
]
