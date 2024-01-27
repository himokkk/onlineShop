import io
import random
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from categories.models import Category


@override_settings(DATABASES={"default": {"ENGINE": "django.db.backends.dummy"}})
class CategoryViewsTest(SimpleTestCase):
    databases = ["default"]

    def setUp(self):
        self.client = APIClient()

    @patch("categories.models.is_svg", return_value=True)
    def test_create_category_view_valid_data(self, mock_is_svg):
        in_memory_file = io.BytesIO(b"random bytes")
        uploaded_file = SimpleUploadedFile(
            name="testfile.txt", content=in_memory_file.read()
        )

        data = {"name": "Test Category", "svg": uploaded_file}
        response = self.client.post("/categories/create/", data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.first().name, "Test Category")
        Category.objects.all().delete()

    @patch("categories.models.is_svg", return_value=False)
    def test_create_category_view_invalid_svg(self, mock_is_svg):
        in_memory_file = io.BytesIO(b"random bytes")
        uploaded_file = SimpleUploadedFile(
            name="testfile.txt", content=in_memory_file.read()
        )

        data = {"name": "Test Category", "svg": uploaded_file}
        response = self.client.post("/categories/create/", data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Category.objects.count(), 0)

    def test_list_categories_view(self):
        Category.objects.all().delete()
        Category.objects.create(name="Category 1")
        Category.objects.create(name="Category 2")
        self.assertEqual(len(Category.objects.all()), 2)

        response = self.client.get("/categories/list/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
