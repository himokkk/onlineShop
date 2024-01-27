from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase

from categories.models import Category, is_svg


class CategoryModelTest(SimpleTestCase):
    databases = ["default"]
    valid_svg_content = b'<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>'
    invalid_file_content = b"This is not an SVG file."

    @patch("categories.models.is_svg", return_value=True)
    def test_svg_validator_valid_file(self, _mock_is_svg):
        valid_svg_file = SimpleUploadedFile(
            "valid_svg.svg", self.valid_svg_content, content_type="image/svg+xml"
        )

        category = Category(name="Test Category", svg=valid_svg_file)
        category.full_clean()

    @patch("categories.models.is_svg", return_value=False)
    def test_svg_validator_invalid_file(self, _mock_is_svg):
        invalid_file = SimpleUploadedFile(
            "invalid_file.txt", self.invalid_file_content, content_type="text/plain"
        )

        category = Category(name="Invalid Category", svg=invalid_file)

        with self.assertRaises(ValidationError):
            category.full_clean()

    @patch("categories.models.is_svg", return_value=True)
    def test_svg_validator_no_file(self, _mock_is_svg):
        category = Category(name="No SVG Category")
        category.full_clean()

    @patch("categories.models.is_svg", return_value=False)
    def test_svg_validator_empty_file(self, _mock_is_svg):
        empty_file = SimpleUploadedFile(
            "empty_file.svg", b"", content_type="image/svg+xml"
        )

        category = Category(name="Empty SVG Category", svg=empty_file)

        with self.assertRaises(ValidationError):
            category.full_clean()

    def test_is_svg(self):
        valid_svg_file = SimpleUploadedFile(
            "valid_svg.svg", self.valid_svg_content, content_type="image/svg+xml"
        )
        self.assertTrue(is_svg(valid_svg_file))

    def test_is_svg(self):
        valid_svg_file = SimpleUploadedFile(
            "valid_svg.svg", self.invalid_file_content, content_type="image/svg+xml"
        )
        self.assertFalse(is_svg(valid_svg_file))
