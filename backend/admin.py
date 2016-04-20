from django.contrib import admin

# Register your models here.

from backend.models import *

class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_category_name')

    def get_category_name(self, obj):
        return obj.category.name

class FilledSubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_category_name', 'get_university')

    def get_category_name(self, obj):
        return obj.filled_category.category.name

    def get_university(self, obj):
        return obj.filled_category.university.name

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'role', 'position', 'get_university')

    def get_university(self, obj):
        return obj.university.name

admin.site.register(ProfileCategory)
admin.site.register(ProfileSubcategory, SubcategoryAdmin)
admin.site.register(University)
admin.site.register(UniFiles)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(FilledCategory)
admin.site.register(FilledSubcategory, FilledSubcategoryAdmin)