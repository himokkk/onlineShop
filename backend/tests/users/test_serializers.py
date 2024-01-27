from django.contrib.auth.models import User
from django.test import TestCase

from products.models import Product
from users.models import UserProfile
from users.serializers import UserProfileSerializer


class UserProfileSerializerTest(TestCase):
    databases = ["default"]

    def setUp(self):
        self.user = User.objects.create_user(username="user_serializer")
        self.profile = UserProfile.objects.get(user=self.user)
        self.product = Product.objects.create(name="Test Product")
        self.profile.cart.add(self.product)
        self.serializer = UserProfileSerializer(instance=self.profile)

    def test_image_url(self):
        expected_url = None
        if self.profile.image:
            expected_url = self.profile.image.url
        self.assertEqual(self.serializer.data["image_url"], expected_url)

    def test_username(self):
        self.assertEqual(self.serializer.data["username"], self.user.username)

    def test_cart(self):
        self.assertEqual(len(self.serializer.data["cart"]), 1)
        self.assertEqual(self.serializer.data["cart"][0]["id"], self.product.id)
        self.assertEqual(self.serializer.data["cart"][0]["name"], self.product.name)
