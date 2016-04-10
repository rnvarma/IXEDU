from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect

from backend.models import *

# Create your views here.

mapping = {
    "risk reduction": "riskreduction",
    "secondary prevention": "riskreduction",
    "risk": "riskreduction",
    "primary prevention": "primaryprevention",
    "faculty-staff training": "facultystafftraining",
    "faculty staff training": "facultystafftraining",
    "title IX office": "titleixoffice",
    "titleIX office": "titleixoffice",
    "titleix office": "titleixoffice",
    "title ix office": "titleixoffice",
    "volunteer group": "volunteergroup",
    "volunteer": "volunteergroup",
    "student initiative": "studentinitiative",
    "mens group": "mensgroup",
    "other offices": "otheroffices",
    "stats on campus reports": "oncampusreports",
    "campus reports": "oncampusreports",
    "stats on all reports": "allreports",
    "all reports": "allreports",
    "stats on climate studies": "climatestudy",
    "climate study": "climatestudy",
    "consent": "consent",
    "sexual assault": "sexualassault",
    "sexual harassment": "sexualharassment",
    "stalking": "stalking",
    "dating violence": "datingviolence",
    "domestic violence": "domesticviolence",
    "awareness about policies": "aboutpolicies",
    "policies": "aboutpolicies",
    "awareness about reporting": "aboutreporting",
    "reporting": "aboutreporting",
}

reverse_mapping = {mapping[key]: key for key in mapping}

def getMatchesOfFields(fields):
    forms = University.objects.all()
    unis = []
    for form in forms:
        for field in fields:
            if form.__getattribute__(field):
                unis.append(form)
                break
    return unis

class SearchPage(View):
    def get(self, request):
        context = {}
        query = request.GET.get("q")
        if not query: query = ""
        query = query.split(",")
        fields = []
        for q_word in query:
            fields.append(mapping[q_word])
        matches = []
        # matches = getMatchesOfFields(fields)
        universities = []
        print matches
        for match in matches:
            for field in fields:
                data = {}
                data["university_name"] = match.college.name
                data["topic"] = reverse_mapping[field]
                data["description"] = match.__getattribute__(field + "Desc")
                data["university_pic"] = match.college.logo
                data["id"] = match.college.id
                universities.append(data)
        import random
        context["q"] = query
        context["universities"] = universities
        return render(request, 'search-results.html', context)

class AllUniversities(View):
    def get(self, request):
        context = {}
        context["unis"] = University.objects.all()
        if request.user.is_anonymous():
            return render(request, 'all_universities.html', context)
        else:
            context["uni"] = request.user.customuser.university
            return render(request, 'all_universities.html', context)


