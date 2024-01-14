from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _


class Hash(models.Model):
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE)
    hash = models.CharField(max_length=64, unique=True)

    class Meta:
        verbose_name = _("Hash")
        verbose_name_plural = _("Hashes")

    def __str__(self) -> str:
        return "User's " + str(self.user)


admin.site.register(Hash)
