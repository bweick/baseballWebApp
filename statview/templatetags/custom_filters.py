from django import template
from collections import OrderedDict

register = template.Library()

def dict_ord(value):
    rename = {'player_name':'Name', 'home_id':'Team', 'year':'Year', 'pa':'PA',
            'hr_rate':'HR%', 'so_rate':'SO%','bb_rate':'BB%', 'xbh_rate':'XBH%',
            'xbph_rate':'X/H%', 'sow':'SO/BB', 'abso':'AB/SO', 'abhr':'AB/HR',
            'abrbi':'AB/RBI', 'gbfb':'GB/FB', 'goao':'GO/AO', 'ip_rate':'IP%',
            'ld_rate':'LD%', 'hrfb':'HR/FB', 'iffb':'IF/FB'}

    order = ['Name', 'Team', 'Year', 'PA','HR%', 'SO%','BB%', 'XBH%', 'X/H%', 'SO/BB', 'AB/SO',
            'AB/HR', 'AB/RBI', 'GB/FB', 'GO/AO', 'IP%', 'LD%', 'HR/FB', 'IF/FB']

    out = OrderedDict()
    new_dict = {}

    for key in rename:
        new_dict[rename[key]] = value[key]

    for val in order:
        out[val] = new_dict[val]
    return out.items()

def get_type(value):
    return type(value).__name__

register.filter('dict_ord', dict_ord)
register.filter('get_type', get_type)
