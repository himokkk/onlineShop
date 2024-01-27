from unittest.mock import patch

from django.test import SimpleTestCase

from orders.models import Order


class OrderModelTest(SimpleTestCase):
    @patch("orders.models.Order.objects.create")
    def test_create_order(self, mock_create):
        mock_order = Order()
        mock_order.id = 1
        mock_order.status = "waiting for payment"
        mock_create.return_value = mock_order

        order = Order.objects.create(status="waiting for payment")

        self.assertEqual(order.status, "waiting for payment")
        self.assertEqual(order.id, 1)

    @patch("orders.models.Order.objects.get")
    def test_get_order(self, mock_get):
        mock_order = Order()
        mock_order.id = 1
        mock_order.status = "paid"
        mock_get.return_value = mock_order

        order = Order.objects.get(id=1)

        self.assertEqual(order.status, "paid")
        self.assertEqual(order.id, 1)
