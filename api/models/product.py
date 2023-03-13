import datetime

from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _

from .user import UserProfile
from .category import Category


class Product(models.Model):
    name = models.CharField(max_length=60, verbose_name=_("name"))
    price = models.FloatField(blank=True, null=True, verbose_name=_("price"))
    description = models.TextField(default="", blank=True)
    owner = models.ForeignKey(
        UserProfile, null=True, on_delete=models.CASCADE)
    post_date = models.DateTimeField(
        default=datetime.datetime.now, verbose_name=_("post date")
    )
    image = models.ImageField(blank=True, null=True, upload_to="products")
    category = models.ForeignKey(
        Category, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = _("Product")

    def __str__(self) -> str:
        return "{} {}".format(self.name, self.category)


admin.site.register(Product)
