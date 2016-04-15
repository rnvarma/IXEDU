from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.http import JsonResponse, HttpResponse

from backend.models import *
# Create your views here.

def has_edit_priveleges(user):
    if user.is_anonymous(): return False
    cu = user.customuser
    role = cu.role
    roles = {
        "admin": True,
        "collaborator": True,
        "request": False,
        "": False
    }
    if role in roles: return roles[role]
    else: return False

class UniversityProfile(View):
    def get(self, request, u_id):
        context = {}
        context["uni"] = University.objects.get(id=u_id)
        context["files"] = context["uni"].files.all()
        context["categories"] = []
        first = True
        cats = ProfileCategory.objects.all().order_by("order")
        for cat in cats:
            uni_cat, _ = FilledCategory.objects.get_or_create(category=cat, university=context["uni"])
            uni_cat.subcats = []
            uni_cat.name = cat.name
            uni_cat.first = first
            first = False
            for subcat in cat.subcategories.all():
                uni_subcat, _ = FilledSubcategory.objects.get_or_create(filled_category=uni_cat, name=subcat.name)
                uni_cat.subcats.append(uni_subcat)
            context["categories"].append(uni_cat)
        context["can_edit"] = has_edit_priveleges(request.user)
        context["admins"] = context["uni"].members.filter(role="admin")
        context["collaborators"] = context["uni"].members.filter(role="collaborator")
        if context["can_edit"]:
            return render(request, 'university_edit_profile.html', context)
        else:
            return render(request, 'university_profile.html', context)

class UniversityPhoto(View):
    def post(self, request):
        u_id = request.POST.get("u_id")
        uni = University.objects.get(id=u_id)
        uni.logo = request.FILES['profile_image']
        uni.save()
        return HttpResponseRedirect("/uni/%s" % u_id)

class UniversityMetaData(View):
    def post(self, request):
        u_id = request.POST.get("u_id")
        uni = University.objects.get(id=u_id)
        fields = request.POST.get("fields")
        for field in fields.split(","):
            if not field: continue
            field_data = request.POST.get(field)
            uni.__setattr__(field, field_data)
        uni.save()
        return JsonResponse({"worked": True})

class UniversityForm(View):
    def get(self, request, u_id):
        context = {}
        context["uni"] = University.objects.get(id=u_id)
        cats = ProfileCategory.objects.all().order_by("order")
        context["categories"] = []
        i = 0
        for cat in cats:
            uni_cat, _ = FilledCategory.objects.get_or_create(category=cat, university=context["uni"])
            uni_cat.num = i
            uni_cat.subcats = []
            uni_cat.name = cat.name
            j = 0
            for subcat in cat.subcategories.all():
                uni_subcat, _ = FilledSubcategory.objects.get_or_create(filled_category=uni_cat, name=subcat.name)
                uni_subcat.href = "".join(uni_subcat.name.split())
                uni_subcat.id = uni_subcat.href + "-id"
                uni_subcat.parity = j
                j = 0 if j else 1
                uni_cat.subcats.append(uni_subcat)
            context["categories"].append(uni_cat)
            i += 1
        context["num_cats"] = len(context["categories"])
        context["cat_nums"] = range(1, context["num_cats"] + 1)
        context["num_bars"] = context["num_cats"] - 1
        context["bar_nums"] = range(1, context["num_bars"] + 1)
        return render(request, 'university_form.html', context)

    def post(self, request, u_id):
        u = University.objects.get(id=u_id)
        cats = ProfileCategory.objects.all()
        for cat in cats:
            uni_cat, _ = FilledCategory.objects.get_or_create(category=cat, university=u)
            for subcat in cat.subcategories.all():
                uni_subcat, _ = FilledSubcategory.objects.get_or_create(filled_category=uni_cat, name=subcat.name)
                description = request.POST.get(uni_cat.category.name + " - " + uni_subcat.name)
                uni_subcat.description = description
                uni_subcat.save()
        return HttpResponseRedirect("/uni/%s/form" % u_id)

class UniversityEditResources(View):
    def get(self, request, u_id):
        context = {}
        context["uni"] = University.objects.get(id=u_id)
        context["files"] = context["uni"].files.all()
        context["can_edit"] = has_edit_priveleges(request.user)
        return render(request, 'university_resources.html', context)







