# from channels.db import database_sync_to_async
# from channels.testing import WebsocketCommunicator
# from django.contrib.auth.models import User
# from django.test import TestCase
# from rest_framework_simplejwt.tokens import AccessToken
#
# from chat.consumers import ChatConsumer
# from chat.models import Message

# class ChatConsumerTest(TestCase):
#     def setUp(self):
#         self.user1 = User.objects.create_user(username="user1", password="password1")
#         self.user2 = User.objects.create_user(username="user2", password="password2")
#         self.access_token1 = AccessToken.for_user(self.user1)
#         self.access_token2 = AccessToken.for_user(self.user2)
#
#     async def test_receive_message(self):
#         communicator1 = WebsocketCommunicator(
#             ChatConsumer.as_asgi(),
#             f"/ws/chat/{self.user2.id}/?token={self.access_token1}",
#         )
#         communicator2 = WebsocketCommunicator(
#             ChatConsumer.as_asgi(),
#             f"/ws/chat/{self.user1.id}/?token={self.access_token1}",
#         )
#         await communicator1.connect()
#         await communicator2.connect()
#
#         message_content = "Hello, user2!"
#         await communicator1.send_json_to(
#             {"type": "chat_message", "message": message_content}
#         )
#
#         response = await communicator2.receive_json()
#         self.assertEqual(response["message"], message_content)
#
#         await communicator1.disconnect()
#         await communicator2.disconnect()
#
#     async def test_save_message(self):
#         communicator1 = WebsocketCommunicator(
#             ChatConsumer.as_asgi(),
#             f"/ws/chat/{self.user1.id}/?token={self.access_token1}",
#         )
#         communicator2 = WebsocketCommunicator(
#             ChatConsumer.as_asgi(),
#             f"/ws/chat/{self.user2.id}/?token={self.access_token2}",
#         )
#         await communicator1.connect()
#         await communicator2.connect()
#
#         message_content = "Hello, user2!"
#         await communicator1.send_json_to(
#             {"type": "chat_message", "message": message_content}
#         )
#         await self.get_message(message_content)
#
#         await communicator1.disconnect()
#         await communicator2.disconnect()
#
#     @database_sync_to_async
#     def get_message(self, message_content):
#         message = Message.objects.filter(
#             from_user=self.user1, to_user=self.user2, message=message_content
#         ).first()
#         self.assertIsNotNone(message)
