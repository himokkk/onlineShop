import datetime

from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator

from .user import UserProfile
from .product import Product


class Review(models.Model):
    content = models.TextField(max_length=1500, verbose_name=_("name"))
    grade = models.IntegerField(
        default=1,
        validators=[
            MaxValueValidator(5),
            MinValueValidator(1)
        ]
    )
    owner = models.ForeignKey(
        UserProfile, null=True, blank=False, on_delete=models.SET_NULL)
    product = models.ForeignKey(
        Product, null=True, on_delete=models.CASCADE)
    post_date = models.DateTimeField(
        default=datetime.datetime.now, verbose_name=_("post date")
    )


admin.site.register(Review)
