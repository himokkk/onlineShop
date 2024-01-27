from rest_framework import status
from rest_framework.authtoken.admin import User
from rest_framework.test import APITestCase

from categories.models import Category
from products.models import Product


class ProductListViewTest(APITestCase):
    databases = ["default"]
    product_list_url = "/products/list/"

    def setUp(self):
        self.user = User.objects.create(username="testuser", password="testpassword")
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(name="Test Category")
        for i in range(50):
            Product.objects.create(
                name=f"Product {i}",
                price=i,
                shipping_price=i,
                owner=self.user.profile,
                category=self.category,
            )

    def test_product_list_view(self):
        response = self.client.get(self.product_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 25)

    def test_product_list_view_with_query_params(self):
        query_params = {
            "size": 10,
            "category": self.category.id,
            "owner": self.user.profile.id,
            "min-price": 10,
            "max-price": 100,
            "sort": "price_ascending",
            "page": 2,
        }
        response = self.client.get(self.product_list_url, query_params)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 10)
