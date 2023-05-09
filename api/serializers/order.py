from rest_framework import serializers

from ..models import Order, UserProfile
from .product import ProductSerializer
from rest_framework.authtoken.models import Token


class OrderSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "items", "owner",
                  "owner_name", "package_number", "street", "status"]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result.update(
            {"items": ProductSerializer(
                instance.items.all(), many=True).data}
        )
        return result

    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.user.username


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "status"
        ]
