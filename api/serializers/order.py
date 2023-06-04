from rest_framework import serializers

from ..models import Order, UserProfile
from .product import ProductSerializer
from rest_framework.authtoken.models import Token


class OrderSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    total_products_cost = serializers.SerializerMethodField()
    total_shipping_cost = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "items", "owner",
                  "owner_name", "total_products_cost", "total_shipping_cost", "package_number", "street", "status"]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result.update(
            {"items": ProductSerializer(
                instance.items.all(), many=True, context=self.context).data}
        )
        return result

    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.user.username

    def get_total_products_cost(self, obj):
        price = 0
        for item in obj.items.all():
            price += item.price
        return price

    def get_total_shipping_cost(self, obj):
        price = 0
        for item in obj.items.all():
            price += item.shipping_price
        return price


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "status"
        ]
