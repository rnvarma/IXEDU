from django.conf.urls import include, url

from university.views import *

urlpatterns = [
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)$', UniversityProfile.as_view()),
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)/form$', UniversityForm.as_view()),
    url(r'^uploadphoto$', UniversityPhoto.as_view()),
    url(r'^editmetadata$', UniversityMetaData.as_view())
]
