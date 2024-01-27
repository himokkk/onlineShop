from django.utils import timezone
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from orders.models import Order
from orders.serializers import OrderSerializer, OrderStatusSerializer
from products.models import Review


class OrderListView(ListAPIView):
    """A view for retrieving and creating orders.

    Inherits from ListAPIView to provide a list of orders.
    Requires authentication for accessing the view.
    Uses OrderSerializer for serializing order data.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def post(self, request: Request, *args, **kwargs) -> Response:
        """
        Handles the POST request for creating a new order.

        Retrieves query parameters from the request data.
        Filters the queryset based on the owner and status.
        Updates the status of orders that have been sent for delivery.
        Serializes the queryset and returns the serialized data as a response.
        """

        queryset = self.queryset.all()

        query_params = self.request.data

        user_profile = request.user.profile
        queryset = queryset.filter(owner=user_profile)

        status = self.request.GET.get("status", None)
        if status:
            queryset = queryset.filter(status=status)
        if query_params:
            size = query_params.get("size", None)
            if size:
                size = int(size)
            else:
                size = 25

        items_count = queryset.count()
        page = query_params.get("page", 1)
        start_index = size * (int(page) - 1)
        end_index = start_index + size
        queryset = queryset[start_index:end_index]
        if status == "sent":
            for instance in queryset:
                if (
                    timezone.now() - timezone.timedelta(minutes=2)
                    > instance.modified_date
                ):
                    instance.status = "delivered"
                    instance.save()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class OrderCreateView(CreateAPIView):
    """
    API view for creating an order.

    This view requires authentication and expects the following data in the request:
    - 'items[]': A list of item IDs representing the items to be included in the order.

    Upon successful creation of the order, it returns a response with the serialized order data
    and a status code of 201 (Created).
    """

    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def create(self, request: Request, *args, **kwargs) -> Response:
        """
        Create a new order.

        Args:
            request (HttpRequest): The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response object containing the serialized order data.

        Raises:
            ValidationError: If the serializer data is invalid.
        """
        data = request.data.dict()
        user_profile = request.user.profile
        data["owner"] = user_profile.id
        items = request.data.getlist("items[]")
        data["items"] = items
        for item in items:
            Review.objects.get_or_create(owner=user_profile, product_id=item)
        user_profile.cart.clear()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class OrderStatusView(UpdateAPIView):
    """
    A view for updating the status of an order.

    This view requires authentication and allows users to update the status of an order.
    The status can be changed to "sent", "delivered", or "paid" depending on the user's permissions.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = OrderStatusSerializer
    queryset = Order.objects.all()
    lookup_field = "pk"

    def partial_update(self, request: Request, pk: int) -> Response:
        """
        Update the status of an order.

        This method is called when a PATCH request is made to the view.
        It updates the status of the order based on the request data.
        The status can be changed to "sent", "delivered", or "paid" depending on the user's permissions.
        If the status is changed to "sent" or "delivered", additional checks are performed to ensure
        that the user has the necessary permissions to change the status.
        """

        request_data = request.data.copy()
        request_data.pop("items", None)

        order_status = request_data.get("status")
        try:
            user_profile = request.user.profile
            order_instance = Order.objects.get(pk=pk)
            if order_status != "sent":
                request_data.pop("package_number", None)
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
                {"message": "User Token incorrect"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer = self.get_serializer(
            instance=self.get_object(), data=request_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class OrderRetrieveView(RetrieveAPIView):
    """
    A view for retrieving a single order.

    Inherits from RetrieveAPIView which provides the default implementation
    for retrieving a single object.

    Attributes:
        permission_classes (list): List of permission classes applied to the view.
        serializer_class: Serializer class used for serializing and deserializing the order data.
        queryset: Queryset used for retrieving the order object.

    Methods:
        retrieve(request, *args, **kwargs): Retrieves a single order object and updates its status if necessary.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()

    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        """
        Retrieves a single order object and updates its status if necessary.

        If the order status is "sent" and the modified date is more than 2 minutes ago,
        the status is updated to "delivered".

        Args:
            request: The request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The serialized order data.
        """
        instance = self.get_object()

        if (
            instance.status == "sent"
            and timezone.now() - timezone.timedelta(minutes=2) > instance.modified_date
        ):
            instance.status = "delivered"
            instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
