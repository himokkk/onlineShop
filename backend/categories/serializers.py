from rest_framework import serializers

from categories.models import Category


class CategorySerializer(serializers.ModelSerializer):
    svg_url = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "svg_url"]

    def get_svg_url(self, obj):
        if obj.svg:
            return obj.svg.url


class CategoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "svg"]
