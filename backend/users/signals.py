from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.admin import User

from users.models import UserProfile


@receiver(post_save, sender=User)
def create_profile(_sender, instance, **kwargs):
    """Create a user profile for the given instance if it doesn't already exist.

    Args:
        _sender: The sender of the signal.
        instance: The instance triggering the signal.
        **kwargs: Additional keyword arguments.
    """
    UserProfile.objects.get_or_create(user=instance)
