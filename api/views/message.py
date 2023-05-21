from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from ..serializers import MessageSerializer
from ..models import Message


class MessageCreateView(CreateAPIView):
    serializer_class = MessageSerializer
    def post(self, request):
        authorization_header = request.META.get('HTTP_AUTHORIZATION')
        user_instance = get_object_or_404(Token, key=authorization_header).user

        data = request.data.dict()
        if user_instance.id == int(data.get("to_user")):
            return Response({"message": "Cannot send message to yourself."}, status=404)
        data["from_user"] = user_instance.id
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


class MessageListView(APIView):
    serializer_class = MessageSerializer
    def get(self, request, pk):
        authorization_header = request.META.get('HTTP_AUTHORIZATION')
        from_user_instance = get_object_or_404(Token, key=authorization_header).user
        to_user_instance = get_object_or_404(User, pk=pk)
        queryset1 = Message.objects.filter(from_user=from_user_instance, to_user=to_user_instance)
        queryset2 = Message.objects.filter(from_user=to_user_instance, to_user=from_user_instance)
        queryset = queryset1 | queryset2
        queryset = queryset.order_by("-date")
        data = list(queryset.values("id", "from_user", "to_user", "message", "date"))
        return Response(data)
