from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from .user import UserProfile
from .product import Product


class Order(models.Model):
    items = models.ManyToManyField(Product, blank=True)
    owner = models.ForeignKey(UserProfile, null=True, on_delete=models.CASCADE)
    status = models.CharField(max_length=30, default="waiting for payment", choices=[
        ("waiting for payment", "waiting for payment"), ("paid", "paid"), ("sent", "sent"), ("delivered", "delivered")])
    package_number = models.CharField(null=True, blank=True, max_length=50)

    class Meta:
        verbose_name = _("Order")

    def __str__(self) -> str:
        return "Order " + str(self.id)


admin.site.register(Order)
