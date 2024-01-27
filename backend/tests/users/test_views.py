import io

from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.test import TestCase
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from products.models import Product
from users.models import UserProfile


class UserViewsTest(TestCase):
    databases = ["default"]

    username = "UserViewsTest"
    password = "password"

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username=self.username, password=self.password
        )
        self.profile = UserProfile.objects.get(user=self.user)
        self.access_token = AccessToken.for_user(self.user)

    def test_login_view(self):
        response = self.client.post(
            "/users/login/", {"username": self.username, "password": self.password}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_logged_user_view(self):
        response = self.client.post(
            "/users/current/", headers={"Authorization": f"Bearer {self.access_token}"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user.profile.id)

    def test_user_view(self):
        response = self.client.get(
            f"/users/{self.user.profile.id}",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user.profile.id)

    def test_user_list_view(self):
        response = self.client.get("/users/list/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))

    def test_change_user_image_view(self):
        image = Image.new("RGB", (60, 30), color=(73, 109, 137))
        image_io = io.BytesIO()
        image.save(image_io, "JPEG")
        image_data = image_io.getvalue()
        image_file = ContentFile(image_data, "test.jpg")

        response = self.client.put(
            "/users/avatar_change/",
            {"image": image_file},
            format="multipart",
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Image changed successfully", response.data["message"])

    def test_cart_add_view(self):
        product = Product.objects.create(name="Test Product")
        response = self.client.post(
            "/users/cart/add/",
            {"item": product.id},
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(product.id, [item["id"] for item in response.data["cart"]])

    def test_cart_remove_view(self):
        product = Product.objects.create(name="Test Product")
        self.user.profile.cart.add(product)
        response = self.client.post(
            "/users/cart/remove/",
            {"item": product.id},
            headers={"Authorization": f"Bearer {self.access_token}"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn(product.id, [item["id"] for item in response.data["cart"]])
