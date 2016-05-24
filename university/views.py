from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.http import JsonResponse, HttpResponse

from backend.models import *
# Create your views here.

def has_edit_priveleges(user, uni):
    if user.is_anonymous(): return False
    cu = user.customuser
    if cu.university != uni: return False
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
        if not request.user.is_anonymous():
            context["uni"] = request.user.customuser.university
        context["view_uni"] = University.objects.get(id=u_id)
        context["files"] = context["view_uni"].files.all().exclude(archived=True)
        context["categories"] = []
        first = True
        cats = ProfileCategory.objects.all().order_by("order")
        for cat in cats:
            uni_cat, _ = FilledCategory.objects.get_or_create(category=cat, university=context["view_uni"])
            uni_cat.subcats = []
            uni_cat.name = cat.name
            uni_cat.first = first
            first = False
            for subcat in cat.subcategories.all():
                uni_subcat, _ = FilledSubcategory.objects.get_or_create(filled_category=uni_cat, name=subcat.name)
                uni_cat.subcats.append(uni_subcat)
            context["categories"].append(uni_cat)
        context["can_edit"] = has_edit_priveleges(request.user, context["view_uni"])
        context["admins"] = context["view_uni"].members.filter(role="admin")
        context["collaborators"] = context["view_uni"].members.filter(role="collaborator")
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
        if has_edit_priveleges(request.user, context["uni"]):
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
                    uni_subcat.href = ("".join(uni_subcat.name.split())).replace("/", "_")
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
        else:
            return HttpResponseRedirect("/uni/%s" % u_id)

    def post(self, request, u_id):
        u = University.objects.get(id=u_id)
        if has_edit_priveleges(request.user, u):
            cats = ProfileCategory.objects.all()
            for cat in cats:
                uni_cat, _ = FilledCategory.objects.get_or_create(category=cat, university=u)
                for subcat in cat.subcategories.all():
                    uni_subcat, _ = FilledSubcategory.objects.get_or_create(filled_category=uni_cat, name=subcat.name)
                    description = request.POST.get(uni_cat.category.name + " - " + uni_subcat.name)
                    uni_subcat.description = description
                    uni_subcat.save()
            return HttpResponseRedirect("/uni/%s/form" % u_id)
        else:
            return HttpResponseRedirect("/")

class UniversityEditResources(View):
    def get(self, request, u_id):
        context = {}
        context["uni"] = University.objects.get(id=u_id)
        context["files"] = context["uni"].files.all().exclude(archived=True)
        context["can_edit"] = has_edit_priveleges(request.user, context["uni"])
        response = render(request, 'university_resources.html', context)
        response.set_cookie('university_id', u_id)
        return response

class UniversityRemoveResources(View):
    def post(self, request):
        resource_id = request.POST.get('resource_id')
        resource = UniFiles.objects.get(id=resource_id)
        resource.archived = True
        resource.save()
        return JsonResponse({'status': 200, 'resource_removed': resource_id})

class UniversityAddResources(View):
    def post(self, request):
        uid = request.POST.get('university_id')
        name = request.POST.get('resource-name')
        desc = request.POST.get('resource-desc')
        typ = request.POST.get('type')

        uni = University.objects.get(id=uid)

        if typ == 'link':
            link = request.POST.get('link')
            res = UniFiles(university=uni, name=name, description=desc, link=link)
            res.save()
        elif typ == 'file':
            fil = request.FILES.get('file')
            res = UniFiles(university=uni, name=name, description=desc, uploaded_file=fil)
            res.save()

        return JsonResponse({'status': 200, 'resource_added': res.id})
