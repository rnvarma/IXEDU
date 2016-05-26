from django.conf.urls import include, url
from django.views.decorators.csrf import ensure_csrf_cookie, requires_csrf_token

from university.views import *

urlpatterns = [
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)$', UniversityProfile.as_view()),
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)/form$', UniversityForm.as_view()),
    url(r'^uni/(?P<u_id>[a-zA-Z0-9_.-]+)/editresources$', UniversityResources.as_view()),
    url(r'^removeresource$',
        requires_csrf_token(UniversityRemoveResources.as_view())),
    url(r'^addresource$',
        requires_csrf_token(UniversityAddResources.as_view())),
    url(r'^changeresource$',
        requires_csrf_token(UniversityChangeResource.as_view())),
    url(r'^changeresourceorder$',
        requires_csrf_token(UniversityChangeResourceOrder.as_view())),
    url(r'^uploadphoto$',
        requires_csrf_token(UniversityPhoto.as_view())),
    url(r'^editmetadata$',
        requires_csrf_token(UniversityMetaData.as_view())),
    url(r'^changeuniadmin$',
        requires_csrf_token(UniversityChangeAdmins.as_view())),
    url(r'^removeuniadmin$',
        requires_csrf_token(UniversityRemoveAdmin.as_view())),
    url(r'^adduniadmin$',
        requires_csrf_token(UniversityAddAdmin.as_view())),
]
