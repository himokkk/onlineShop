from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from products.models import Product, Review
from users.models import UserProfile


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer class for the Product model.

    Serializes the Product model fields and provides additional methods
    to retrieve related data such as category name, owner name, image URL,
    and whether the product has a review.

    Attributes:
        category_name (serializers.SerializerMethodField): Method field to retrieve the category name.
        owner_name (serializers.SerializerMethodField): Method field to retrieve the owner name.
        image_url (serializers.SerializerMethodField): Method field to retrieve the image URL.
        has_review (serializers.SerializerMethodField): Method field to check if the product has a review.

    Methods:
        to_representation(instance): Overrides the default representation method to include reviews.
        get_category_name(obj): Retrieves the category name for a given product.
        get_owner_name(obj): Retrieves the owner name for a given product.
        get_image_url(obj): Retrieves the image URL for a given product.
        get_has_review(obj): Checks if the product has a review.

    """

    category_name = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    has_review = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "shipping_price",
            "post_date",
            "category",
            "category_name",
            "owner",
            "owner_name",
            "image_url",
            "image",
            "description",
            "has_review",
        ]

    def to_representation(self, instance):
        """
        Convert the given instance into a dictionary representation.

        Args:
            instance: The instance to be converted.

        Returns:
            A dictionary representation of the instance, including the reviews associated with the product.
        """
        result = super().to_representation(instance)
        reviews = Review.objects.filter(product=instance)
        result.update(
            {"reviews": ReviewSerializer(reviews, many=True, context=self.context).data}
        )
        return result

    def get_category_name(self, obj):
        """
        Returns the name of the category associated with the given object.

        Args:
            obj: The object for which to retrieve the category name.

        Returns:
            The name of the category if it exists, otherwise None.
        """
        if obj.category:
            return obj.category.name

    def get_owner_name(self, obj):
        """
        Returns the name of the owner of the object.

        Args:
            obj: The object for which to retrieve the owner's name.

        Returns:
            str: The name of the owner, or None if the owner is not set.
        """
        if obj.owner:
            return str(obj.owner)

    def get_image_url(self, obj):
        """
        Returns the URL of the image associated with the given object.

        Args:
            obj: The object for which to retrieve the image URL.

        Returns:
            str: The URL of the image, or None if no image is available.
        """
        if obj.image:
            return obj.image.url

    def get_has_review(self, obj):
        """
        Determines if the user has reviewed the product.

        Args:
            obj: The product object.

        Returns:
            bool: True if the user has reviewed the product, False otherwise.
        """
        try:
            request = self.context.get("request")
            auth_header = request.META.get("HTTP_AUTHORIZATION")
            if not auth_header:
                return False
            user_instance = get_object_or_404(Token, key=auth_header).user
            user_profile_instance = get_object_or_404(UserProfile, user=user_instance)
        except:
            return True
        try:
            review_instance = Review.objects.get(
                owner=user_profile_instance, product=obj
            )
            if review_instance.overall_rating or review_instance.delivery_rating:
                return True
            return False
        except:
            return True


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer class for creating a new product.

    This serializer is used to validate and serialize the data when creating a new product.
    It specifies the fields that should be included in the serialized representation of the product.
    """

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "shipping_price",
            "category",
            "description",
            "image",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = "__all__"

    def get_owner_name(self, obj):
        if obj.owner:
            return str(obj.owner)


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
