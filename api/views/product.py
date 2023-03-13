from rest_framework.generics import CreateAPIView, ListAPIView
from django.db.models.query import QuerySet
from django.db.models import Min
from rest_framework.response import Response

from ..models import Product, Category
from ..serializers import ProductSerializer, ProductCreateSerializer


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get(self, request):
        queryset = self.queryset.all()
        items_count = queryset.count()      
        
        query_params = self.request.query_params
        if query_params:
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
                items_count = queryset.count()

            owner = query_params.get("owner", None)
            if owner:
                queryset = queryset.filter(owner=int(owner))
                

            min_price = query_params.get("min-price", None)
            max_price = query_params.get("max-price", None)
            if min_price and max_price:
                queryset = queryset.all().filter(price__lte = int(max_price), price__gte = int(min_price))
            elif min_price:
                queryset = queryset.all().filter(price__gte = int(min_price))
            elif max_price:
                queryset = queryset.all().filter(price__lte = int(max_price)) 

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

            page = query_params.get("page", 1)
            start_index = size * (int(page) - 1)
            end_index = start_index + size
            queryset = queryset[start_index:end_index]
            
        serializer = self.get_serializer(queryset, many=True)
        response_data = {'count': items_count, 'results': serializer.data}
        return Response(response_data)

class ProductCreateView(CreateAPIView):
    serializer_class = ProductCreateSerializer
    queryset = Product.objects.all()
