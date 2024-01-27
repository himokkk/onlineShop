from django.test import TestCase

from categories.models import Category
from categories.serializers import CategorySerializer


class CategorySerializerTest(TestCase):
    databases = ["default"]

    def setUp(self):
        self.category = Category.objects.create(name="Test Category")
        self.serializer = CategorySerializer(instance=self.category)

    def test_svg_url(self):
        expected_url = None
        if self.category.svg:
            expected_url = self.category.svg.url
        self.assertEqual(self.serializer.data["svg_url"], expected_url)

    def test_id(self):
        self.assertEqual(self.serializer.data["id"], self.category.id)

    def test_name(self):
        self.assertEqual(self.serializer.data["name"], self.category.name)
