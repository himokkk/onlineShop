from rest_framework import serializers

from . import ProductSerializer
from ..models import Order, Product


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["items", "status", "package_number"]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result.update({"items": ProductSerializer(instance.items.all(), many=True).data})
        return result


