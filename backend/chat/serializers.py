from rest_framework import serializers

from chat.models import Message


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for the Message model."""

    class Meta:
        model = Message
        fields = ["id", "from_user", "to_user", "message"]
