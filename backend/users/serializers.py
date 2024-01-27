from django.contrib.auth.models import User
from rest_framework import serializers

from products.serializers import ProductSerializer
from users.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for the UserProfile model."""

    image_url = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",
            "description",
            "birth",
            "image_url",
            "username",
        ]

    def to_representation(self, instance: UserProfile) -> str:
        """Converts the given instance into a dictionary representation.

        Args:
            instance: The instance to be converted.

        Returns:
            A dictionary representation of the instance, with the 'cart' field
            containing serialized data of the 'cart' objects.

        """
        result = super().to_representation(instance)
        result.update({"cart": ProductSerializer(instance.cart.all(), many=True).data})
        return result

    def get_image_url(self, obj: UserProfile) -> str:
        """Returns the URL of the image associated with the given object.

        Args:
            obj: The object for which to retrieve the image URL.

        Returns:
            str: The URL of the image, or None if no image is available.
        """
        if obj.image:
            return obj.image.url

    def get_username(self, obj: UserProfile) -> str:
        """Returns the username of the user associated with the given object.

        Args:
            obj: The object for which to retrieve the username.

        Returns:
            The username of the associated user, or None if no user is found.
        """
        if obj.user:
            return obj.user.username


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""

    class Meta:
        model = User
        fields = ["id", "username", "password"]
