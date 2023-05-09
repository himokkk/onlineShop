from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.generics import (CreateAPIView, ListAPIView,
                                     RetrieveAPIView, UpdateAPIView)
from rest_framework.response import Response

from ..models import Order, UserProfile
from ..permission import TokenProvidedPermission
from ..serializers import OrderSerializer, OrderStatusSerializer


class OrderListView(ListAPIView):
    permission_classes = [TokenProvidedPermission]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def post(self, request):
        queryset = self.queryset.all()

        query_params = self.request.data
        token = query_params.get("token", None)
        user = Token.objects.get(key=token).user
        user_profile = UserProfile.objects.get(user=user)
        queryset = queryset.filter(owner=user_profile)
        if query_params:
            size = query_params.get("size", None)
            if size:
                size = int(size)
            else:
                size = 25

        # items_count = queryset.count()
        # page = query_params.get("page", 1)
        # start_index = size * (int(page) - 1)
        # end_index = start_index + size
        # queryset = queryset[start_index:end_index]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class OrderCreateView(CreateAPIView):
    permission_classes = [TokenProvidedPermission]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.dict()
        token = request.data.get("token", None)
        user = Token.objects.get(key=token).user
        user_profile = UserProfile.objects.get(user=user)
        data["owner"] = user_profile.id
        items = request.data.getlist("items[]")
        data["items"] = items
        # user_profile.cart.clear()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        print(data)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class OrderStatusView(UpdateAPIView):
    permission_classes = [TokenProvidedPermission]
    serializer_class = OrderStatusSerializer
    queryset = Order.objects.all()
    lookup_field = "pk"

    def partial_update(self, request, pk):
        request_data = request.data.copy()
        request_data.pop("items", None)
        request_data.pop("package_number", None)

        order_status = request_data.get("status")
        token = request.data.get("token", None)
        try:
            user = Token.objects.get(key=token).user
            user_profile = UserProfile.objects.get(user=user)
            order_instance = Order.objects.get(pk=pk)
            if order_status == "sent" or order_status == "delivered":
                items = order_instance.items
                if not items.first() or not user_profile == items.first().owner:
                    return Response(
                        {"message": "You are not allowed to change this status"},
                        status=status.HTTP_403_FORBIDDEN,
                    )
            elif order_status == "paid":
                if not user_profile == order_instance.owner:
                    return Response(
                        {"message": "You are not allowed to change this status"},
                        status=status.HTTP_403_FORBIDDEN,
                    )
        except:
            return Response(
                {"message": "User Token incorrect"}, status=status.HTTP_401_UNAUTHORIZED
            )
        serializer = self.get_serializer(
            instance=self.get_object(), data=request_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class OrderRetrieveView(RetrieveAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
