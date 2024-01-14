import hashlib
import random
import string

from django.contrib.auth import logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import UserProfile
from products.models import Product
# from backend.api.permission import TokenProvidedPermission
from users.serializers import UserProfileSerializer, UserSerializer


class LoggedUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_profile = request.user.profile
        data = UserProfileSerializer(user_profile).data
        return Response(data)


class UserView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def get(self, request, pk):
        user_profile = UserProfile.objects.get(pk=pk)
        data = UserProfileSerializer(user_profile).data

        owner = request.user.profile == user_profile
        data.update({"owner": owner})
        return Response(data)


class UserListView(ListAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()


class UserCreateView(CreateAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()


class ChangeUserImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user_profile = request.user.profile

        image_file = request.FILES.get("image")
        if image_file:
            user_profile.image = image_file
            user_profile.save()
            return Response({"message": "Image changed successfully"})
        else:
            return Response({"message": "No image provided"}, status=400)


class PasswordResetView(APIView):
    pass
    # def put(self, request, hash):
    #     new_password = request.data.get("password", None)
    #     if not new_password:
    #         return Response(status=404)
    #
    #     hash_instance = get_object_or_404(Hash, hash=hash)
    #     user_instance = hash_instance.user
    #     user_instance.set_password(new_password)
    #     user_instance.save()
    #     hash_instance.delete()
    #     return Response(status=200)



class RegisterView(CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = request.data.get("password")
        user_instance = serializer.save()
        user_instance.set_password(password)
        user_instance.save()
        return Response(
            {"message": "User registered successfully."}, status=status.HTTP_201_CREATED
        )


def admin_logout_view(request):
    logout(request)
    response = redirect("/#")
    response.delete_cookie("token")
    return response


class CartAddView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def post(self, request):
        item = request.data.get("item", None)
        if not item:
            return Response(
                {"message": "Product not provided"}, status=status.HTTP_401_UNAUTHORIZED
            )
        user_profile = request.user.profile
        product_instance = Product.objects.get(pk=int(item))
        user_profile.cart.add(product_instance)

        return Response(self.serializer_class(user_profile).data)


class CartRemoveView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def post(self, request):
        item = request.data.get("item", None)
        if not item:
            return Response(
                {"message": "Product not provided"}, status=status.HTTP_401_UNAUTHORIZED
            )

        product_instance = Product.objects.get(pk=int(item))
        user_profile = request.user.profile
        user_profile.cart.remove(product_instance)

        return Response(self.serializer_class(user_profile).data)
