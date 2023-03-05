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

        queryset = self.queryset.all()
        
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
            queryset = queryset.filter(category=category_instance[0])

        sort = query_params.get("sort", None)
        if sort:
            if sort == "price_ascending":
                queryset = queryset.order_by('price')
            elif sort == "price_descending":
                queryset = queryset.order_by('price').reverse()
            elif sort == "name_ascending":
                queryset = queryset.order_by('name')
            elif sort == "name_descending":
                queryset = queryset.order_by('name').reverse()
            elif sort == "newest":
                queryset = queryset.order_by('post_date').reverse()
            elif sort == "oldest":
                queryset = queryset.order_by('post_date')

        page = query_params.get("page", None)
        if page:
            start_index = size * (int(page) - 1)
            end_index = start_index + size
            queryset = queryset[start_index:end_index]
        else:
            queryset = queryset[:size]
        return queryset.all()


class ProductCreateView(CreateAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
