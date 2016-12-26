# -*- coding: utf-8 -*-
"""
Created on Thu Oct  6 18:03:21 2016

@author: Brian
"""

from django.conf.urls import url

from . import views

app_name='statview'
urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'simulation', views.simulation, name='sim'),
    url(r'^(?P<home>[a-zA-Z]+)/$', views.roster, name='roster'),
    url(r'^(?P<url>[a-z0-9.]+)/$', views.stats, name='stats')
]
