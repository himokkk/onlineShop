from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from ..models import UserProfile
from ..serializers import UserProfileSerializer


class LoggedUserView(APIView):
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token", None)
        if not token:
            return Response("")
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
