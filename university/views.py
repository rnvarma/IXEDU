from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.http import JsonResponse, HttpResponse

import sys
import json

import requests

from backend.models import *
# Create your views here.

def slugify(inp):
    return inp.replace(' ', '').replace('/','-')

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

class UniversityChangeMetadata(View):
    def post(self, request):
        u_name = request.POST.get('u_name')

        uni = University.objects.get(name=u_name)

        uni.city = request.POST.get('city')
        uni.state = request.POST.get('state')
        uni.undergrad = request.POST.get('ug')
        uni.grad = request.POST.get('g')
        uni.program_size = request.POST.get('ps')

        uni.save()

        return JsonResponse({ 'worked': True })

class UniversityProfile(View):
    def resource_to_json(self, resource):
        result = {
            'name': resource.name,
            'desc': resource.description,
            'fileValue': {
                'name': resource.uploaded_file.name
            },
            'urlValue': resource.link,
            'ordering': resource.ordering,
            'image': resource.thumbnail.name,
            'type': 'url' if resource.link != '' else 'file'
        }

        return result

    def get(self, request, u_id):
        context = {}
        university = University.objects.get(id=u_id)
        context["view_uni_name"] = university.name
        context["view_uni_json"] = json.dumps({
            'name': university.name,
            'state': university.state,
            'city': university.city,
            'undergrad': university.undergrad,
            'grad': university.grad,
            'program_size': university.program_size,
            'id': university.id,
            'logo': university.logo.name
        })
        context["view_uni_admins_json"] = json.dumps(
            map(lambda x: {
                'phone': x.phone_number,
                'email': x.email,
                'name': x.name,
                'position': x.position,
                'img': x.thumbnail.name
            }, university.members.filter(role="admin").order_by('ordering'))
        )
        context["view_uni_collabs_json"] = json.dumps(
            map(lambda x: {
                'phone': x.phone_number,
                'email': x.email,
                'name': x.name,
                'position': x.position,
                'img': x.thumbnail.name
            }, university.members.filter(role="collaborator").order_by('ordering'))
        )
        context["view_uni_resources"] = json.dumps(map(self.resource_to_json,
          university.files.all().exclude(archived=True).order_by('ordering')))

        if not request.user.is_anonymous():
          context["has_admin_priv"] = request.user.customuser.role == 'admin';
        if not request.user.is_anonymous():
            context["uni"] = request.user.customuser.university

        categories = []
        cats = ProfileCategory.objects.all().order_by("order")

        for cat in cats:
            filled_cat, _ = \
                FilledCategory.objects.get_or_create(category=cat, university=university)

            uni_cat = {
                'subcats': [],
                'name': cat.name,
                'slug': slugify(cat.name)
            }

            for subcat in cat.subcategories.all():
                filled_subcat, _ = \
                    FilledSubcategory.objects.get_or_create(
                        filled_category=filled_cat,
                        name=subcat.name
                    )

                uni_subcat = {
                    'name': subcat.name,
                    'slug': slugify(subcat.name),
                    'desc': filled_subcat.description
                }

                uni_cat['subcats'].append(uni_subcat)

            categories.append(uni_cat)

        context["can_edit"] = json.dumps(has_edit_priveleges(request.user, university))
        context["categories"] = json.dumps(categories)

        return render(request, 'university_profile.html', context)

class UniversityPhoto(View):
    def post(self, request):
        u_id = request.POST.get("u_id")
        uni = University.objects.get(id=u_id)
        uni.logo = request.FILES['profile_image']
        uni.save()
        return HttpResponseRedirect("/uni/%s" % u_id)

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
        uni = University.objects.get(id=u_id)
        context = {}
        context["uni_name"] = uni.name
        context["uni_id"] = u_id
        context["files"] = uni.files.all().exclude(archived=True).order_by('ordering')
        context["can_edit"] = has_edit_priveleges(request.user, uni)
        response = render(request, 'university_resources.html', context)
        response.set_cookie('university_id', u_id)
        return response

class UniversityGetResources(View):
    def get(self, request):
        u_id = request.GET.get('u_id')
        files = University.objects.get(id=u_id).files.all().exclude(archived=True).order_by('ordering')
        filesJSON = map(lambda x:
            {
                'resourceID': x.id,
                'resourceName': x.name,
                'resourceDesc': x.description,
                'urlValue': x.link,
                'fileValue': {
                    'name': x.uploaded_file.name
                },
                'ordering': x.ordering,
                'type': 'url' if x.link != '' else 'file'
            },
            files)
        return JsonResponse({'status': 200, 'files': filesJSON})

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

        if typ == 'url':
            link = request.POST.get('url')
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
