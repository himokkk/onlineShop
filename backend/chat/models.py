from django.contrib import admin
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Message(models.Model):
    """Represents a message sent from one user to another.

    Attributes:
        from_user (User): The user who sent the message.
        to_user (User): The user who received the message.
        message (str): The content of the message.
        date (datetime): The date and time when the message was sent.
    """

    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="from_user"
    )
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="to_user")
    message = models.TextField(default="")
    date = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = _("Message")
        verbose_name_plural = _("Messages")

    def __str__(self) -> str:
        return (
            "Message from "
            + str(self.from_user)
            + " to user "
            + str(self.to_user)
            + " message: "
            + self.message[:20]
        )


admin.site.register(Message)
