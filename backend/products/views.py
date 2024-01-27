from rest_framework import status
from rest_framework.generics import (CreateAPIView, ListAPIView,
                                     RetrieveAPIView, UpdateAPIView,
                                     get_object_or_404)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from categories.models import Category
from products.models import Product, Review
from products.serializers import ProductSerializer, ReviewSerializer


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get(self, request):
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
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def create(self, request, *args, **kwargs):
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
    serializer_class = ProductSerializer
    queryset = Product.objects.all()


class ReviewListView(ListAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()


class ReviewUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
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
