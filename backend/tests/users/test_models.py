from django.contrib.auth.models import User
from django.test import SimpleTestCase

from users.models import UserProfile


class UserProfileModelTest(SimpleTestCase):
    databases = ["default"]

    def setUp(self):
        # Create a test user. A UserProfile should be created automatically via the signal.
        User.objects.all().delete()
        self.user = User.objects.create_user(username="UserProfileModelTest")

    def test_user_profile_creation(self):
        self.assertTrue(UserProfile.objects.filter(user=self.user).exists())

    def test_user_profile_str(self):
        profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(str(profile), self.user.username)

    def test_profile_update(self):
        # Retrieve and update the UserProfile
        profile = UserProfile.objects.get(user=self.user)
        profile.description = "New description"
        profile.save()

        updated_profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(updated_profile.description, "New description")
