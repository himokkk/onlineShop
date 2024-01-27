import uuid

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from orders.models import Order


class OrderViewsTest(TestCase):
    def setUp(self):
        unique_username = f"testuser_{uuid.uuid4()}"

        self.user = User.objects.create_user(
            username=unique_username, password="testpassword123"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.order = Order.objects.create(
            owner=self.user.profile, status="waiting for payment"
        )

    def test_order_list_view(self):
        response = self.client.get("/orders/list/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_order_create_view(self):
        data = {
            "items": [],
            "owner": self.user.profile.id,
        }
        response = self.client.post("/orders/create/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_order_retrieve_view(self):
        response = self.client.get(f"/orders/{self.order.id}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self):
        self.user.delete()
        self.order.delete()
