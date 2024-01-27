from rest_framework import serializers

from orders.models import Order
from products.serializers import ProductSerializer


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for the Order model."""

    owner_name = serializers.SerializerMethodField()
    total_products_cost = serializers.SerializerMethodField()
    total_shipping_cost = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "items",
            "owner",
            "owner_name",
            "total_products_cost",
            "total_shipping_cost",
            "package_number",
            "street",
            "status",
        ]

    def to_representation(self, instance):
        """Custom representation of the Order instance.
        Includes the serialized representation of the related Product instances.
        """
        result = super().to_representation(instance)
        result.update(
            {
                "items": ProductSerializer(
                    instance.items.all(), many=True, context=self.context
                ).data
            }
        )
        return result

    def get_owner_name(self, obj):
        """Returns the username of the owner of the Order."""
        if obj.owner:
            return obj.owner.user.username

    def get_total_products_cost(self, obj):
        """Calculates and returns the total cost of all products in the Order."""
        price = 0
        for item in obj.items.all():
            price += item.price
        return price

    def get_total_shipping_cost(self, obj):
        """Calculates and returns the total shipping cost of all products in the Order."""
        price = 0
        for item in obj.items.all():
            price += item.shipping_price
        return price


class OrderStatusSerializer(serializers.ModelSerializer):
    """Serializer for the OrderStatus model.

    Serializes the 'id' and 'status' fields of the Order model.
    """

    class Meta:
        model = Order
        fields = ["id", "status"]
