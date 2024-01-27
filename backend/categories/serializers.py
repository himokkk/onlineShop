from rest_framework import serializers

from categories.models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for the Category model."""

    svg_url = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "svg_url"]

    def get_svg_url(self, obj: Category) -> str:
        """Returns the URL of the SVG image associated with the category.
        If no SVG image is available, returns None.
        """
        if obj.svg:
            return obj.svg.url


class CategoryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new category.

    This serializer defines the fields required for creating a new category.
    It includes the `id`, `name`, and `svg` fields.
    """

    class Meta:
        model = Category
        fields = ["id", "name", "svg"]
