import datetime

from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _


class Product(models.Model):
    name = models.CharField(max_length=60, verbose_name=_("name"))
    price = models.FloatField(blank=True, null=True, verbose_name=_("price"))
    shipping_price = models.FloatField(default="0", verbose_name=_("shipping price"))
    description = models.TextField(default="", blank=True)
    owner = models.ForeignKey("users.UserProfile", null=True, on_delete=models.CASCADE)
    post_date = models.DateTimeField(
        default=datetime.datetime.now, verbose_name=_("post date")
    )
    image = models.ImageField(blank=True, null=True, upload_to="products")
    category = models.ForeignKey("categories.Category", null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = _("Product")

    def __str__(self) -> str:
        return "{} {}".format(self.name, self.category)


admin.site.register(Product)

class Review(models.Model):
    RATING_CHOICES = (
        (1, "1"),
        (2, "2"),
        (3, "3"),
        (4, "4"),
        (5, "5"),
    )

    review_type = models.CharField(max_length=20, default="overall")
    overall_rating = models.PositiveIntegerField(
        choices=RATING_CHOICES, blank=True, null=True
    )
    quality_rating = models.PositiveIntegerField(
        choices=RATING_CHOICES, blank=True, null=True
    )
    delivery_rating = models.PositiveIntegerField(
        choices=RATING_CHOICES, blank=True, null=True
    )
    communication_rating = models.PositiveIntegerField(
        choices=RATING_CHOICES, blank=True, null=True
    )
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        "users.UserProfile", null=True, blank=False, on_delete=models.SET_NULL
    )
    product = models.ForeignKey(Product, null=True, on_delete=models.CASCADE)
    post_date = models.DateTimeField(
        default=datetime.datetime.now, verbose_name=_("post date")
    )

    def __str__(self) -> str:
        return (
            "Review"
            + str(self.id)
            + " "
            + str(self.owner.id)
            + " "
            + str(self.product.id)
        )

    def save(self, *args, **kwargs):
        if self.review_type == "overall":
            self.quality_rating = None
            self.delivery_rating = None
            self.communication_rating = None
        else:
            self.overall_rating = None
        super().save(*args, **kwargs)


admin.site.register(Review)
