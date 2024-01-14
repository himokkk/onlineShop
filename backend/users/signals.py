from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.admin import User

from users.models import UserProfile


@receiver(post_save, sender=User)
def create_profile(sender, instance, **kwargs):
    UserProfile.objects.get_or_create(user=instance)
