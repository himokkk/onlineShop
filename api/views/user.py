from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser

from ..models import Product, UserProfile
from ..permission import TokenProvidedPermission
from ..serializers import UserProfileSerializer


class LoggedUserView(APIView):
    authentication_classes = []
    permission_classes = [TokenProvidedPermission]

    def post(self, request):
        token = request.data.get("token", None)
        user = Token.objects.get(key=token).user
        user_profile = UserProfile.objects.get(user=user)
        data = UserProfileSerializer(user_profile).data
        return Response(data)


class UserView(RetrieveAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def get(self, request, pk):
        owner = False
        user_profile = UserProfile.objects.get(pk=pk)
        data = UserProfileSerializer(user_profile).data
        authorization_header = request.META.get('HTTP_AUTHORIZATION')

        if authorization_header:
            user = Token.objects.get(key=authorization_header).user
            token_user_profile = UserProfile.objects.get(user=user)
            owner = token_user_profile == user_profile

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
    permission_classes = []

    def put(self, request, *args, **kwargs):
        authorization_header = request.META.get('HTTP_AUTHORIZATION')

        if not authorization_header:
            return Response("x", status=404)
        user = Token.objects.get(key=authorization_header).user
        user_profile = UserProfile.objects.get(user=user)


        image_file = request.FILES.get('image')
        if image_file:
            user_profile.image = image_file
            user_profile.save()
            return Response({'message': 'Image changed successfully'})
        else:
            return Response({'message': 'No image provided'}, status=400)

class CartAddView(APIView):
    permission_classes = [TokenProvidedPermission]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def post(self, request):
        token = request.data.get("token", None)
        item = request.data.get("item", None)
        if not item:
            return Response(
                {"message": "Product not provided"}, status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            user = Token.objects.get(key=token).user
            user_profile = UserProfile.objects.get(user=user)
        except:
            return Response(
                {"message": "User Token incorrect"}, status=status.HTTP_401_UNAUTHORIZED
            )
        product_instance = Product.objects.get(pk=int(item))
        user_profile.cart.add(product_instance)

        return Response(self.serializer_class(user_profile).data)


class CartRemoveView(APIView):
    permission_classes = [TokenProvidedPermission]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def post(self, request):
        token = request.data.get("token", None)
        item = request.data.get("item", None)
        if not item:
            return Response(
                {"message": "Product not provided"}, status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            user = Token.objects.get(key=token).user
            user_profile = UserProfile.objects.get(user=user)
        except:
            return Response(
                {"message": "User Token incorrect"}, status=status.HTTP_401_UNAUTHORIZED
            )
        product_instance = Product.objects.get(pk=int(item))
        user_profile.cart.remove(product_instance)

        return Response(self.serializer_class(user_profile).data)
