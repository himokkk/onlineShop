import re

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


def validate_svg(file):
    SVG_R = r"(?:<\?xml\b[^>]*>[^<]*)?(?:<!--.*?-->[^<]*)*(?:<svg|<!DOCTYPE svg)\b"
    SVG_RE = re.compile(SVG_R, re.DOTALL)
    file_contents = file.read().decode("latin_1")
    is_svg = SVG_RE.match(file_contents) is not None
    if not is_svg:
        raise ValidationError("File not svg")


class Category(models.Model):
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
