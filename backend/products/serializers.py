from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from products.models import Product, Review
from users.models import UserProfile


class ProductSerializer(serializers.ModelSerializer):
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
        result = super().to_representation(instance)
        reviews = Review.objects.filter(product=instance)
        result.update(
            {"reviews": ReviewSerializer(reviews, many=True, context=self.context).data}
        )
        return result

    def get_category_name(self, obj):
        if obj.category:
            return obj.category.name

    def get_owner_name(self, obj):
        if obj.owner:
            return str(obj.owner)

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url

    def get_has_review(self, obj):
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
