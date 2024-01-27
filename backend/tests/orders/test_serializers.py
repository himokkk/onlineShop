from django.test import TestCase
from rest_framework.authtoken.admin import User

from orders.models import Order
from orders.serializers import OrderSerializer
from products.models import Product


class OrderSerializerTest(TestCase):
    databases = ["default"]

    def setUp(self):
        self.user = User.objects.create_user(username="test_user")
        self.product1 = Product.objects.create(
            name="Product 1", price=10, shipping_price=5
        )
        self.product2 = Product.objects.create(
            name="Product 2", price=20, shipping_price=8
        )
        self.order = Order.objects.create(owner=self.user.profile)
        self.order.items.add(self.product1, self.product2)
        self.serializer = OrderSerializer(instance=self.order)

    def test_owner_name(self):
        self.assertEqual(self.serializer.data["owner_name"], self.user.username)

    def test_total_products_cost(self):
        expected_cost = self.product1.price + self.product2.price
        self.assertEqual(self.serializer.data["total_products_cost"], expected_cost)

    def test_total_shipping_cost(self):
        expected_cost = self.product1.shipping_price + self.product2.shipping_price
        self.assertEqual(self.serializer.data["total_shipping_cost"], expected_cost)
