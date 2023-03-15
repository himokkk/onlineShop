from rest_framework import serializers

from ..models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "shipping_price", "post_date",
                  "category", "category_name", "owner", "owner_name", "image_url", "description"]

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name

    def get_owner_name(self, obj):
        if obj.owner:
            return str(obj.owner)

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "shipping_price",
                  "category", "description", "image"]
