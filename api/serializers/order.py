from rest_framework import serializers

from .product import ProductSerializer
from ..models import Order, Product


class OrderSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True)

    class Meta:
        model = Order
        fields = ["items", "status", "package_number"]

    def to_representation(self, instance):
        result = super().to_representation(instance)
        result.update({"items": ProductSerializer(instance.items.all(), many=True).data})
        return result

    def create(self, data):
        items_data = data.pop("items", [])
        order = Order.objects.create(**data)

        for item_data in items_data:
            product = Product.objects.get(id=int(item_data))
            order.items.add(product)
        return order
