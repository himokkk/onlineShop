from rest_framework.generics import CreateAPIView, ListAPIView

from ..models import Category
from ..serializers import CategorySerializer


class CategoryListView(ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class CategoryCreateView(CreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
