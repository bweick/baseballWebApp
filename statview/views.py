import django_filters
import json
from django.shortcuts import get_list_or_404, render
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict
from .models import Teams, Players, Ratiobatters
from django.views import generic
from .serializers import RatioSerializer
from rest_framework import viewsets, filters, generics
from .pyScripts import batterSim

###functions
def index(request):
    team = Teams.objects.all().order_by('home_id')
    context = {'team': team}
    return render(request, 'statview/index.html', context)

def roster(request, home):
    players = Players.objects.filter(home_id=home).exclude(url__isnull=True).order_by('player_name')
    context = {'players':players,
               'home':home}
    return render(request, 'statview/roster.html', context)

def stats(request, url):
    stats = Ratiobatters.objects.filter(url=url, year='2016').first()
    name = Players.objects.get(url=url)

    if stats:
        stats = model_to_dict(stats)
    context = {'stats':stats,
               'name':name}
    return render(request, 'statview/stats.html', context)

def simulation(request):
    if request.method == 'GET':
        out = batterSim.sim_season(request.GET['url'], request.GET['profile'])
    return HttpResponse(json.dumps(out), content_type='application/json')

#filters
class RatioFilter(django_filters.FilterSet):
    min_ld = django_filters.NumberFilter(name='ld_rate', lookup_expr='gte')
    max_ld = django_filters.NumberFilter(name='ld_rate', lookup_expr='lte')

    class Meta:
        model = Ratiobatters
        fields = ('home_id', 'year', 'min_ld', 'max_ld')
        #fields = ('home_id', 'year')

#views and viewsets
class IndexView(generic.ListView):
    template_name = 'statview/index.html'
    context_object_name = 'team'

    def get_queryset(self):
        return Teams.objects.all().order_by('home_id')

class RosterView(generic.ListView):
    template_name = 'staview/roster.html'
    context_object_name = 'players'

    def get_queryset(self):
        return Players.objects.filter(home_id=home).exclude(url__isnull=True).order_by('player_name')

class StatsViewSet(viewsets.ModelViewSet):
    queryset = Ratiobatters.objects.all()
    #queryset = Ratiobatters.objects.all()

    serializer_class = RatioSerializer
    #filter_fields = RatioFilter
    filter_fields = ('home_id', 'year', 'url')
