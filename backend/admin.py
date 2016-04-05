from django.contrib import admin

# Register your models here.

from backend.models import *

admin.site.register(ProfileCategory)
admin.site.register(ProfileSubcategory)
admin.site.register(University)
admin.site.register(CustomUser)
admin.site.register(FilledCategory)
admin.site.register(FilledSubcategory)