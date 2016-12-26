
from .models import Ratiobatters
from rest_framework import serializers

class RatioSerializer(serializers.ModelSerializer):
    """Serializing RatioBatter outputs"""
    class Meta:
        model = Ratiobatters
        fields = ('player_name', 'year', 'ld_rate', 'gbfb', 'hr_rate', 'so_rate',
                    'bb_rate', 'pa', 'ip_rate', 'iffb', 'playeryear')
