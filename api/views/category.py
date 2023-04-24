from rest_framework.generics import CreateAPIView, ListAPIView

from ..models import Category
from ..serializers import CategoryCreateSerializer, CategorySerializer


class CategoryListView(ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class CategoryCreateView(CreateAPIView):
    serializer_class = CategoryCreateSerializer
    queryset = Category.objects.all()
