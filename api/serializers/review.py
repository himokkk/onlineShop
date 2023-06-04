from django.conf import settings
from rest_framework import serializers

from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = '__all__'

    def get_owner_name(self, obj):
        if obj.owner:
             return str(obj.owner)


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
