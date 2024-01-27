import uuid

from django.test import TestCase
from rest_framework.test import APIClient


from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
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

    def test_order_create_view(self):
        data = {
            "items": [],
            "owner": self.user.profile.id,
        }
        Order.objects.all().delete()
        response = self.client.post("/orders/create/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)

    def test_order_retrieve_view(self):
        response = self.client.get(f"/orders/{self.order.id}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.order.id)

    def tearDown(self):
        self.user.delete()
        self.order.delete()


class OrderListViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword123"
        )
        self.client.force_authenticate(user=self.user)

    def test_order_list_view(self):
        response = self.client.get("/orders/list/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_order_list_view_with_status_filter(self):
        response = self.client.get("/orders/list/", {"status": "sent"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_order_list_view_pagination(self):
        response = self.client.get("/orders/list/", {"page": 2, "size": 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_order_list_view_auto_delivery(self):
        order = Order.objects.create(owner=self.user.profile, status="sent")
        response = self.client.get("/orders/list/", {"status": "sent"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["status"], "sent")
        order.refresh_from_db()
        self.assertEqual(order.status, "sent")

    def tearDown(self):
        self.user.delete()
