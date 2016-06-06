from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.http import JsonResponse, HttpResponse

import sys

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

class UniversityChangeAdmins(View):
    def post(self, request):
        uni_id = request.POST.get('uni_id')
        adminordering = request.POST.getlist('admin_ordering[]')
        collabordering = request.POST.getlist('collab_ordering[]')

        for order, cu_id in enumerate(adminordering):
            cu = CustomUser.objects.get(id=cu_id)

            new_pos = ''.join(['changed_positions[',cu_id,']'])
            if request.POST.get(new_pos) is not None:
                cu.position = request.POST.get(new_pos)

            cu.ordering = order
            cu.role = 'admin'
            cu.save()
        for order, cu_id in enumerate(collabordering):
            cu = CustomUser.objects.get(id=cu_id)

            new_pos = ''.join(['changed_positions[',cu_id,']'])
            if request.POST.get(new_pos) is not None:
                cu.position = request.POST.get(new_pos)

            cu.ordering = order
            cu.role = 'collaborator'
            cu.save()

        return JsonResponse({'status': 200})

class UniversityRemoveAdmin(View):
    def post(self, request):
        cu_id = request.POST.get('cu_id')

        cu = CustomUser.objects.get(id=cu_id)
        cu.role = ''
        cu.save();

        return JsonResponse({'status': 200})

class UniversityAddAdmin(View):
    def post(self, request):
        email = request.POST.get('email')
        u_id = request.POST.get('u_id')

        cu = CustomUser.objects.get(email=email)
        cu.role = 'collaborator'
        cu.save()

        if cu.university.id != int(u_id):
            return JsonResponse({ 'worked': False })
        return JsonResponse({
            'worked': True,
            'cu_id': cu.id,
            'name': cu.name,
            'position': cu.position,
        })

class UniversityProfile(View):
    def get(self, request, u_id):
        context = {}
        if not request.user.is_anonymous():
            context["uni"] = request.user.customuser.university
            context["has_admin_priv"] = request.user.customuser.role == 'admin';
        context["view_uni"] = University.objects.get(id=u_id)
        context["files"] = context["view_uni"].files.all().exclude(archived=True).order_by('ordering')
        context["categories"] = []
        first = True
        cats = ProfileCategory.objects.all().order_by("order")
        for cat in cats:
            uni_cat, _ = FilledCategory.objects.get_or_create(category=cat, university=context["view_uni"])
            uni_cat.subcats = []
            uni_cat.name = cat.name
            uni_cat.first = first
            uni_cat.href = uni_cat.name.replace(' ', '').replace('/', '_')
            first = False
            for subcat in cat.subcategories.all():
                uni_subcat, _ = FilledSubcategory.objects.get_or_create(filled_category=uni_cat, name=subcat.name)
                uni_subcat.href = uni_subcat.name.replace(' ', '').replace('/', '_')
                uni_cat.subcats.append(uni_subcat)
            context["categories"].append(uni_cat)
        context["can_edit"] = has_edit_priveleges(request.user, context["view_uni"])
        context["admins"] = context["view_uni"].members.filter(role="admin").order_by('ordering')
        context["collaborators"] = context["view_uni"].members.filter(role="collaborator").order_by('ordering')
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
            context["active_cat"] = 0
            context["active_subcat"] = request.GET.get('subcat','')
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

                if cat.name.lower() == request.GET.get('cat', '').lower():
                    context["active_cat"] = i
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
            return HttpResponseRedirect("/uni/%s" % u_id)
        else:
            return HttpResponseRedirect("/")

class UniversityResources(View):
    def get(self, request, u_id):
        context = {}
        context["uni"] = University.objects.get(id=u_id)
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
            res = UniFiles(university=uni, name=name, description=desc, link=link, ordering=1000)
            res.save()
        elif typ == 'file':
            fil = request.FILES.get('file')
            res = UniFiles(university=uni, name=name, description=desc, uploaded_file=fil, ordering=1000)
            res.save()

        return JsonResponse({'status': 200, 'resource_added': res.id})

class UniversityChangeResource(View):
    def post(self, request):
        file_id = request.POST.get('file_id')

        fil = UniFiles.objects.get(id=file_id)
        fil.name = request.POST.get('name')
        fil.desc = request.POST.get('desc')
        fil.save()

        return JsonResponse({'worked': True})

class UniversityChangeResourceOrder(View):
    def post(self, request):
        order = request.POST.getlist('neworder[]')

        for index, file_id in enumerate(order):
            fil = UniFiles.objects.get(id=file_id)
            fil.ordering = index
            fil.save()

        return JsonResponse({'worked': True})
