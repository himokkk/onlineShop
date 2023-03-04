from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.settings import api_settings

from ..serializers import UserSerializer


class LoginView(ObtainAuthToken):
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        try:
            serializer.is_valid(raise_exception=True)
        except:
            return Response({"error": "1"})
        user = serializer.validated_data["user"]
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
            }
        )


class RegisterView(CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


def admin_logout_view(request):
    logout(request)
    response = redirect("/#")
    response.delete_cookie("token")
    return response
