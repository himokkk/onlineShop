from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from ..models import Order, UserProfile
from ..serializers import OrderSerializer


class OrderListView(ListAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class OrderCreateView(CreateAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

class OrderStatusView(UpdateAPIView):
    # user = Token.objects.get(key=token).user
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    lookup_field = 'pk'

    def partial_update(self, request, pk):
        # Remove fields that should not be updated from request data
        request_data = request.data.copy()
        request_data.pop('items', None)
        request_data.pop('package_number', None)

        order_status = request_data.get("status")
        token = request.data.get("token", None)
        if not token:
            return Response({"message": "User Token not provided"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user = Token.objects.get(key=token).user
            user_profile = UserProfile.objects.get(user=user)
            order_instance = Order.objects.get(pk=pk)
            if order_status == "sent" or order_status == "delivered":
                items = order_instance.items
                if not items.first() or not user_profile == items.first().owner:
                    return Response({"message": "You are not allowed to change this status"}, status=status.HTTP_403_FORBIDDEN)
            elif order_status == "paid":
                if not user_profile == order_instance.owner:
                    return Response({"message": "You are not allowed to change this status"}, status=status.HTTP_403_FORBIDDEN)
        except: 
            return Response({"message": "User Token incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        
        serializer = self.get_serializer(instance=self.get_object(), data=request_data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)