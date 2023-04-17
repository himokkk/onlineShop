from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status

from ..models import UserProfile, Product
from ..serializers import UserProfileSerializer
from ..permission import TokenProvidedPermission


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


class UserListView(ListAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()


class UserCreateView(CreateAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()


class CartAddView(APIView):
    permission_classes = [TokenProvidedPermission]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def post(self, request):
        token = request.data.get("token", None)
        item = request.data.get("item", None)
        if not item:
            return Response({"message": "Product not provided"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user = Token.objects.get(key=token).user
            user_profile = UserProfile.objects.get(user=user)
        except:
            return Response({"message": "User Token incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        product_instance = Product.objects.get(pk=int(item))
        user_profile.cart.add(product_instance)

        return Response(self.serializer_class(user_profile).data)
