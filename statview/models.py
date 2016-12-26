# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models

class Parkfactors(models.Model):
    team = models.TextField(blank=True, primary_key=True, default='MLB')
    l1b = models.IntegerField(db_column='L1B', blank=True, null=True)  # Field name made lowercase.
    r1b = models.IntegerField(db_column='R1B', blank=True, null=True)  # Field name made lowercase.
    l2b = models.IntegerField(db_column='L2B', blank=True, null=True)  # Field name made lowercase.
    r2b = models.IntegerField(db_column='R2B', blank=True, null=True)  # Field name made lowercase.
    l3b = models.IntegerField(db_column='L3B', blank=True, null=True)  # Field name made lowercase.
    r3b = models.IntegerField(db_column='R3B', blank=True, null=True)  # Field name made lowercase.
    lhr = models.IntegerField(db_column='LHR', blank=True, null=True)  # Field name made lowercase.
    rhr = models.IntegerField(db_column='RHR', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'parkFactors'


class Platoonbatters(models.Model):
    player_name = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    player_id = models.IntegerField(blank=True, null=True)
    home_id = models.TextField(blank=True, null=True)
    playersplit = models.TextField(blank=True, primary_key=True, default=url)
    split = models.TextField(blank=True, null=True)
    pa = models.IntegerField(blank=True, null=True)
    ab = models.IntegerField(blank=True, null=True)
    r = models.IntegerField(blank=True, null=True)
    h = models.IntegerField(blank=True, null=True)
    doub = models.IntegerField(blank=True, null=True)
    trip = models.IntegerField(blank=True, null=True)
    hr = models.IntegerField(blank=True, null=True)
    rbi = models.IntegerField(blank=True, null=True)
    sb = models.IntegerField(blank=True, null=True)
    cs = models.IntegerField(blank=True, null=True)
    bb = models.IntegerField(blank=True, null=True)
    so = models.IntegerField(blank=True, null=True)
    ba = models.FloatField(blank=True, null=True)
    obp = models.FloatField(blank=True, null=True)
    slg = models.FloatField(blank=True, null=True)
    ops = models.FloatField(blank=True, null=True)
    tb = models.IntegerField(blank=True, null=True)
    gdp = models.IntegerField(blank=True, null=True)
    hbp = models.IntegerField(blank=True, null=True)
    babip = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'platoonBatters'


class Players(models.Model):
    player_id = models.IntegerField(blank=True, primary_key=True, default=1)
    player_name = models.TextField(blank=True, null=True)
    pos_pitch = models.IntegerField(blank=True, null=True)
    active = models.IntegerField(blank=True, null=True)
    player_bat = models.TextField(blank=True, null=True)
    player_throw = models.TextField(blank=True, null=True)
    home_id = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'players'


class Ratiobatters(models.Model):
    player_name = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    player_id = models.IntegerField(blank=True, null=True)
    home_id = models.TextField(blank=True, null=True)
    playeryear = models.TextField(blank=True, primary_key=True, default=url)
    year = models.IntegerField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    team = models.TextField(blank=True, null=True)
    pa = models.IntegerField(blank=True, null=True)
    hr_rate = models.FloatField(blank=True, null=True)
    so_rate = models.FloatField(blank=True, null=True)
    bb_rate = models.FloatField(blank=True, null=True)
    xbh_rate = models.FloatField(blank=True, null=True)
    xbph_rate = models.FloatField(blank=True, null=True)
    sow = models.FloatField(blank=True, null=True)
    abso = models.FloatField(blank=True, null=True)
    abhr = models.FloatField(blank=True, null=True)
    abrbi = models.FloatField(blank=True, null=True)
    gbfb = models.FloatField(blank=True, null=True)
    goao = models.FloatField(blank=True, null=True)
    ip_rate = models.FloatField(blank=True, null=True)
    ld_rate = models.FloatField(blank=True, null=True)
    hrfb = models.FloatField(blank=True, null=True)
    iffb = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'ratioBatters'
        order_with_respect_to = 'player_name'

    def get_fields(self):
        return [(field.verbose_name, field.value_to_string(self)) for field in Ratiobatters._meta.fields()]


class Teams(models.Model):
    team_id = models.IntegerField(blank=True, null=True)
    league = models.TextField(blank=True, null=True)
    division = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    home_id = models.TextField(blank=True, primary_key=True, default=team_id)

    class Meta:
        db_table = 'teams'
