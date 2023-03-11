from rest_framework import serializers

from ..models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "post_date",
                  "category", "category_name", "image_url"]

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "category", "description", "image"]
