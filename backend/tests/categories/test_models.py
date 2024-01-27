from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase

from categories.models import Category, validate_svg


class CategoryModelTest(SimpleTestCase):
    databases = ["default"]

    invalid_svg_file = SimpleUploadedFile(
        "valid_svg.svg",
        b"This is not an SVG file.",
        content_type="image/svg+xml",
    )
    valid_svg_file = SimpleUploadedFile(
        "valid_svg.svg",
        b'<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>',
        content_type="image/svg+xml",
    )

    @patch("categories.models.validate_svg", return_value=True)
    def test_svg_validator_valid_file(self, _mock_is_svg):
        category = Category(name="Test Category", svg=self.valid_svg_file)
        category.full_clean()

    @patch("categories.models.validate_svg", return_value=False)
    def test_svg_validator_invalid_file(self, _mock_is_svg):
        category = Category(name="Invalid Category", svg=self.invalid_svg_file)

        with self.assertRaises(ValidationError):
            category.full_clean()

    @patch("categories.models.validate_svg", return_value=True)
    def test_svg_validator_no_file(self, _mock_is_svg):
        category = Category(name="No SVG Category")
        category.full_clean()

    @patch("categories.models.validate_svg", return_value=False)
    def test_svg_validator_empty_file(self, _mock_is_svg):
        empty_file = SimpleUploadedFile(
            "empty_file.svg", b"", content_type="image/svg+xml"
        )

        category = Category(name="Empty SVG Category", svg=empty_file)

        with self.assertRaises(ValidationError):
            category.full_clean()

    def test_is_svg_valid(self):
        self.assertIsNone(validate_svg(self.valid_svg_file))

    def test_is_svg_invalid(self):
        with self.assertRaises(ValidationError):
            validate_svg(self.invalid_svg_file)
