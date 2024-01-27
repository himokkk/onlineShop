import datetime

from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _


class Product(models.Model):
    """Represents a product in the online shop.

    Attributes:
        name (str): The name of the product.
        price (float): The price of the product.
        shipping_price (float): The shipping price of the product.
        description (str): The description of the product.
        owner (UserProfile): The owner of the product.
        post_date (datetime): The date when the product was posted.
        image (ImageField): The image of the product.
        category (Category): The category of the product.
    """

    name = models.CharField(max_length=60, verbose_name=_("name"))
    price = models.FloatField(blank=True, null=True, verbose_name=_("price"))
    shipping_price = models.FloatField(default="0", verbose_name=_("shipping price"))
    description = models.TextField(default="", blank=True)
    owner = models.ForeignKey(
        "users.UserProfile",
        null=True,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    post_date = models.DateTimeField(
        default=datetime.datetime.now, verbose_name=_("post date")
    )
    image = models.ImageField(blank=True, null=True, upload_to="products")
    category = models.ForeignKey(
        "categories.Category", null=True, on_delete=models.SET_NULL
    )

    class Meta:
        verbose_name = _("Product")

    def __str__(self) -> str:
        return "{} {}".format(self.name, self.category)


admin.site.register(Product)


class Review(models.Model):
    """Represents a review for a product.

    Attributes:
        review_type (str): The type of review (e.g., "overall", "quality", "delivery").
        overall_rating (int): The overall rating for the product.
        quality_rating (int): The rating for the product's quality.
        delivery_rating (int): The rating for the product's delivery.
        communication_rating (int): The rating for the product's communication.
        description (str): The description of the review.
        owner (UserProfile): The user who wrote the review.
        product (Product): The product being reviewed.
        post_date (datetime): The date and time when the review was posted.
    """

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

    def save(self, *args, **kwargs) -> None:
        if self.review_type == "overall":
            self.quality_rating = None
            self.delivery_rating = None
            self.communication_rating = None
        else:
            self.overall_rating = None
        super().save(*args, **kwargs)


admin.site.register(Review)
