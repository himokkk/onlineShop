from rest_framework import serializers

from ..models import Category


class CategorySerializer(serializers.ModelSerializer):
    svg_url = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "svg_url"]

    def get_svg_url(self, obj):
        if obj.svg:
            return obj.svg.url
