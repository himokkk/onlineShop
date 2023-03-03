from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user")
    image = models.ImageField(blank=True, null=True, upload_to="profile")
    description = models.TextField(default="")
    birth = models.DateField(blank=True, null=True)

    def __str__(self) -> str:
        return str(self.user)


admin.site.register(UserProfile)
