from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from categories.models import Category


@override_settings(DATABASES={"default": {"ENGINE": "django.db.backends.dummy"}})
class CategoryViewsTest(SimpleTestCase):
    databases = ["default"]
    valid_svg_file = SimpleUploadedFile(
        "valid_svg.svg",
        b'<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>',
        content_type="image/svg+xml",
    )

    invalid_svg_file = SimpleUploadedFile(
        "valid_svg.svg",
        b"test",
        content_type="image/svg+xml",
    )

    def setUp(self):
        self.client = APIClient()

    def test_create_category_view_valid_data(self):
        data = {"name": "Test Category", "svg": self.valid_svg_file}
        response = self.client.post("/categories/create/", data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.first().name, "Test Category")
        Category.objects.all().delete()

    def test_create_category_view_invalid_svg(self):
        data = {"name": "Test Category", "svg": self.invalid_svg_file}
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
