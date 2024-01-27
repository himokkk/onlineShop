from django.contrib import admin
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone


class Order(models.Model):
    """Represents an order in the online shop.

    Attributes:
        items (ManyToManyField): The items included in the order.
        owner (ForeignKey): The user who placed the order.
        status (CharField): The status of the order.
        package_number (CharField): The package number of the order.
        first_name (CharField): The first name of the customer.
        last_name (CharField): The last name of the customer.
        phone_number (CharField): The phone number of the customer.
        country (CharField): The country of the customer.
        city (CharField): The city of the customer.
        street (CharField): The street of the customer.
        apartment (CharField): The apartment of the customer.
        postal_code (CharField): The postal code of the customer.
        modified_date (DateTimeField): The date and time when the order was last modified.
    """

    items = models.ManyToManyField("products.Product", blank=True)
    owner = models.ForeignKey("users.UserProfile", null=True, on_delete=models.CASCADE)
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
    apartment = models.CharField(default="", max_length=20)
    postal_code = models.CharField(max_length=255, null=True)
    modified_date = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Order"

    def __str__(self) -> str:
        return "Order " + str(self.id)


@receiver(pre_save, sender=Order)
def update_last_updated(sender, instance:  Order, **kwargs) -> None:
    instance.last_updated = timezone.now()


admin.site.register(Order)
