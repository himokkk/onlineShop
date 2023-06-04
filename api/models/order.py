from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db.models.signals import pre_save
from django.dispatch import receiver

from .product import Product
from .user import UserProfile


class Order(models.Model):
    items = models.ManyToManyField(Product, blank=True)
    owner = models.ForeignKey(UserProfile, null=True, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=30,
        default="waiting for payment",
        choices=[
            ("waiting for payment", "waiting for payment"),
            ("paid", "paid"),
            ("sent", "sent"),
            ("delivered", "delivered"),
        ],
    )
    package_number = models.CharField(null=True, blank=True, max_length=50)
    first_name = models.CharField(max_length=46, null=True)
    last_name = models.CharField(max_length=46, null=True)
    phone_number = models.CharField(max_length=15, null=True)
    country = models.CharField(max_length=35, null=True)
    city = models.CharField(max_length=35, null=True)
    street = models.CharField(max_length=95, null=True)
    apartament = models.CharField(default="", max_length=20)
    postal_code = models.CharField(max_length=255, null=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Order")

    def __str__(self) -> str:
        return "Order " + str(self.id)


@receiver(pre_save, sender=Order)
def update_last_updated(sender, instance, **kwargs):
    instance.last_updated = timezone.now()


admin.site.register(Order)
