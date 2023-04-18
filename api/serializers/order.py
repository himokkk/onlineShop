from rest_framework import serializers

from . import ProductSerializer
from ..models import Order, Product


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "items", "status", "package_number",
                  "first_name", "last_name", "phone_number",
                  "country", "city", "street", "apartament",
                  "postal_code"]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result.update({"items": ProductSerializer(
            instance.items.all(), many=True).data})
        return result
