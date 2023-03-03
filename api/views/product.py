from rest_framework.generics import CreateAPIView, ListAPIView
from django.db.models.query import QuerySet


from ..models import Product, Category
from ..serializers import ProductSerializer


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get_queryset(self: ListAPIView) -> QuerySet:
        query_params = self.request.query_params
        if not query_params:
            return self.queryset.all()

        size = query_params.get("size", None)
        if size:
            size = int(size)
        else:
            size = 25

        category_id = query_params.get("category", None)
        if category_id:
            category_instance = Category.objects.filter(id=category_id)
            if not category_instance:
                return None
            return self.queryset.filter(category=category_instance[0])[:size]
        return self.queryset.all()[:size]


class ProductCreateView(CreateAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
