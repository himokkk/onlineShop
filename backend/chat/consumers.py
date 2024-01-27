import json
from itertools import chain

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import UntypedToken

from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_group_name = None
        self.user = None
        self.receiver = None

    async def connect(self):
        try:
            receiver_pk = self.scope["url_route"]["kwargs"]["user_id"]
            self.receiver = await self.get_user_instance_by_id(receiver_pk)
            token = self.scope["query_string"].decode("utf-8")
            self.user = await self.get_user_instance_by_token(token)
            if int(receiver_pk) == self.user.pk:
                await self.close()

            self.room_group_name = (
                f"chat_{str(self.user.id)}_{str(self.receiver.id)}"
                if self.user.id < self.receiver.id
                else f"chat_{str(self.receiver.id)}_{str(self.user.id)}"
            )
        except Exception:
            await self.close()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        last_10_messages = await self.load_last_messages()
        await self.send(text_data=json.dumps({"messages": last_10_messages}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if "type" in data and data["type"] == "get_older_messages":
            last_message_id = data.get("last_message_id")
            older_messages = await self.load_last_messages(
                **{"id__lt": last_message_id}
            )
            await self.send(text_data=json.dumps({"older_messages": older_messages}))
            return None

        message = data["message"]
        await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def get_user_instance_by_token(self, token):
        decoded_data = UntypedToken(token).payload
        user_pk = decoded_data["user_id"]
        return get_object_or_404(User, pk=user_pk)

    @database_sync_to_async
    def get_user_instance_by_id(self, pk):
        return get_object_or_404(User, pk=pk)

    @database_sync_to_async
    def save_message(self, message_content):
        Message.objects.create(
            from_user=self.user, to_user=self.receiver, message=message_content
        )

    @database_sync_to_async
    def load_last_messages(self, *args, **kwargs):
        queryset1 = Message.objects.filter(
            from_user=self.user, to_user=self.receiver, **kwargs
        ).order_by("-date")[:10]
        queryset2 = Message.objects.filter(
            from_user=self.receiver, to_user=self.user, **kwargs
        ).order_by("-date")[:10]
        combined = list(chain(queryset1, queryset2))

        combined_sorted = sorted(combined, key=lambda x: x.date, reverse=True)[:10]
        return [
            {
                "id": msg.id,
                "message": msg.message,
                "from_user": str(msg.from_user),
                "to_user": str(msg.to_user),
                "date": msg.date.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for msg in combined_sorted
        ]
