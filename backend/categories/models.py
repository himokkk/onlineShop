import re

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


def validate_svg(file):
    """Validates if the given file is an SVG (Scalable Vector Graphics) file.

    Args:
        file (file-like object): The file to be validated.

    Raises:
        ValidationError: If the file is not an SVG file.

    Returns:
        None
    """
    svg_r = r"(?:<\?xml\b[^>]*>[^<]*)?(?:<!--.*?-->[^<]*)*(?:<svg|<!DOCTYPE svg)\b"
    svg_re = re.compile(svg_r, re.DOTALL)
    file_contents = file.read().decode("latin_1")
    is_svg = svg_re.match(file_contents) is not None
    if not is_svg:
        raise ValidationError("File not svg")


class Category(models.Model):
    """Represents a category in the online shop.

    Attributes:
        name (str): The name of the category.
        svg (FileField): The SVG file associated with the category.
    """

    name = models.CharField(max_length=100, unique=True, verbose_name=_("name"))

    svg = models.FileField(
        blank=True, null=True, upload_to="category", validators=[validate_svg]
    )

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self) -> str:
        return self.name


admin.site.register(Category)
