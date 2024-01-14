from rest_framework.generics import CreateAPIView, ListAPIView

from categories.models import Category
from categories.serializers import CategoryCreateSerializer, CategorySerializer


class CategoryListView(ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class CategoryCreateView(CreateAPIView):
    serializer_class = CategoryCreateSerializer
    queryset = Category.objects.all()
