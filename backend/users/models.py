from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    """Represents a user profile in the online shop.

    Attributes:
        user (User): The user associated with the profile.
        image (ImageField): The profile image of the user.
        description (TextField): The description of the user.
        birth (DateField): The birth date of the user.
        cart (ManyToManyField): The products added to the user's cart.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile", default=1)
    image = models.ImageField(blank=True, null=True, upload_to="profile")
    description = models.TextField(default="")
    birth = models.DateField(blank=True, null=True)
    cart = models.ManyToManyField("products.Product", blank=True)

    def __str__(self) -> str:
        return str(self.user)


admin.site.register(UserProfile)
