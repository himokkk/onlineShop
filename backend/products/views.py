from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
    get_object_or_404,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from categories.models import Category
from products.models import Product, Review
from products.serializers import ProductSerializer, ReviewSerializer


class ProductListView(ListAPIView):
    """A view that returns a list of products based on the provided query parameters.

    Query Parameters:
    - size: The number of products to return per page. Default is 25.
    - category: The ID of the category to filter the products by.
    - owner: The ID of the owner to filter the products by.
    - min-price: The minimum price of the products to filter by.
    - max-price: The maximum price of the products to filter by.
    - sort: The sorting order of the products. Possible values are:
        - "price_ascending": Sort by price in ascending order.
        - "price_descending": Sort by price in descending order.
        - "name_ascending": Sort by name in ascending order.
        - "name_descending": Sort by name in descending order.
        - "newest": Sort by post date in descending order.
        - "oldest": Sort by post date in ascending order.
    - page: The page number of the results. Default is 1.

    Returns:
    - count: The total number of products matching the query parameters.
    - results: A list of serialized product objects.
    """

    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get(self, request: Request, *args, **kwargs) -> Response:
        queryset = self.queryset.all()

        query_params = self.request.query_params
        if not query_params:
            serializer = self.get_serializer(queryset[:25], many=True)
            return Response({"results": serializer.data})

        size = query_params.get("size", None)
        size = int(size) if size else 25

        category_id = query_params.get("category", None)
        if category_id:
            category_instance = Category.objects.get(id=category_id)
            queryset = queryset.filter(category=category_instance)

        owner = query_params.get("owner", None)
        if owner:
            queryset = queryset.filter(owner=int(owner))

        min_price = query_params.get("min-price", None)
        max_price = query_params.get("max-price", None)
        if min_price and max_price:
            queryset = queryset.all().filter(
                price__lte=int(max_price), price__gte=int(min_price)
            )
        elif min_price:
            queryset = queryset.all().filter(price__gte=int(min_price))
        elif max_price:
            queryset = queryset.all().filter(price__lte=int(max_price))

        sort = query_params.get("sort", None)
        if sort:
            if sort == "price_ascending":
                queryset = queryset.order_by("price")
            elif sort == "price_descending":
                queryset = queryset.order_by("price").reverse()
            elif sort == "name_ascending":
                queryset = queryset.order_by("name")
            elif sort == "name_descending":
                queryset = queryset.order_by("name").reverse()
            elif sort == "newest":
                queryset = queryset.order_by("post_date").reverse()
            elif sort == "oldest":
                queryset = queryset.order_by("post_date")

        items_count = queryset.count()
        page = query_params.get("page", 1)
        start_index = size * (int(page) - 1)
        end_index = start_index + size
        queryset = queryset[start_index:end_index]

        serializer = self.get_serializer(queryset, many=True)
        response_data = {"count": items_count, "results": serializer.data}
        return Response(response_data)


class ProductCreateView(CreateAPIView):
    """
    View for creating a new product.

    Inherits from CreateAPIView which provides the necessary functionality for creating a new object.
    Requires authentication for the user.
    Uses ProductSerializer for serializing and deserializing the data.
    Retrieves all products from the database.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def create(self, request: Request, *args, **kwargs) -> Response:
        user_profile = request.user.profile

        data = request.data.dict()
        data["owner"] = user_profile.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class ProductRetrieveView(RetrieveAPIView):
    """
    A view for retrieving a single product.

    Inherits from the RetrieveAPIView class and uses the ProductSerializer
    for serializing the product data. The queryset is set to retrieve all
    products from the database.
    """

    serializer_class = ProductSerializer
    queryset = Product.objects.all()


class ReviewListView(ListAPIView):
    """
    A view that returns a list of reviews.

    Inherits from ListAPIView and uses ReviewSerializer
    to serialize the queryset of Review objects.
    """

    serializer_class = ReviewSerializer
    queryset = Review.objects.all()


class ReviewUpdateView(UpdateAPIView):
    """
    API view for updating a review.
    """

    permission_classes = [IsAuthenticated]

    def put(self, request: Request, *args, **kwargs) -> Response:
        """
        Update a review.

        Parameters:
        - request: The HTTP request object.

        Returns:
        - Response: The HTTP response object.
        """
        user_profile_instance = request.user.profile

        product_id = request.data.get("product", None)
        review = get_object_or_404(
            Review, product=product_id, owner=user_profile_instance
        )
        serializer = ReviewSerializer(review, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
