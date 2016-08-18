from django.shortcuts import render
from django.views.generic.base import View
from django.http import HttpResponseRedirect

from backend.models import *

# Create your views here.

import re

from django.db.models import Q

def normalize_query(query_string,
                    findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
                    normspace=re.compile(r'\s{2,}').sub):
    ''' Splits the query string in invidual keywords, getting rid of unecessary spaces
        and grouping quoted words together.
        Example:

        >>> normalize_query('  some random  words "with   quotes  " and   spaces')
        ['some', 'random', 'words', 'with quotes', 'and', 'spaces']

    '''
    return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)]

def get_query(query_string, search_fields):
    ''' Returns a query, that is a combination of Q objects. That combination
        aims to search keywords within a model by testing the given search fields.

    '''
    query = None # Query to search for every search term
    terms = normalize_query(query_string)
    for term in terms:
        or_query = None # Query to search for a given term in each field
        for field_name in search_fields:
            q = Q(**{"%s__icontains" % field_name: term})
            if or_query is None:
                or_query = q
            else:
                or_query = or_query | q
        if query is None:
            query = or_query
        else:
            query = query & or_query
    return query

class SearchPage(View):
    def get(self, request):
      context = {}

      if not request.user.is_anonymous():
          context['uni'] = request.user.customuser.university

      query_string = ''
      found_entries = None
      if ('q' in request.GET) and request.GET['q'].strip():
          query_string = request.GET['q']
          entry_query = get_query(query_string, ['description'])
          found_entries = FilledSubcategory.objects.filter(entry_query).order_by('-id')
          context['query_string'] = query_string
          context['found_entries'] = found_entries

      return render(request, 'search-results.html', context)

class AllUniversities(View):
    def get(self, request):
        context = {}
        context["unis"] = University.objects.all().filter(is_staging=False)

        for uni in context["unis"]:
            total = 0
            total_empty = 0

            cats = ProfileCategory.objects.all().order_by("order")

            for cat in cats:
                uni_cat, _ = FilledCategory.objects.get_or_create(category=cat, university=uni)

                uni_cat.subcats = []

                for subcat in cat.subcategories.all():
                    uni_subcat, _ = FilledSubcategory.objects.get_or_create(filled_category=uni_cat, name=subcat.name)
                    uni_cat.subcats.append(uni_subcat)

                total += len(uni_cat.subcats)
                total_empty += len(filter(lambda x: x.description == "", uni_cat.subcats))

            uni.completion_record = str(total - total_empty) + "/" + str(total)

        if request.user.is_anonymous():
            return render(request, 'all_universities.html', context)
        else:
            context["uni"] = request.user.customuser.university
            return render(request, 'all_universities.html', context)
