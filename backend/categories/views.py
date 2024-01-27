from rest_framework.generics import CreateAPIView, ListAPIView

from categories.models import Category
from categories.serializers import CategoryCreateSerializer, CategorySerializer


class CategoryListView(ListAPIView):
    """A view that returns a list of all categories.

    Inherits from ListAPIView, which provides a read-only endpoint for retrieving a list of objects.
    Uses the CategorySerializer to serialize the Category objects.

    Attributes:
        serializer_class (CategorySerializer): The serializer class used for serializing Category objects.
        queryset (QuerySet): The queryset used for retrieving Category objects from the database.
    """

    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class CategoryCreateView(CreateAPIView):
    """
    API view for creating a new category.

    Inherits from CreateAPIView which provides the default implementation
    for creating a new object using the serializer_class and queryset.

    serializer_class: The serializer class used for validating and
                      deserializing the request data.
    queryset: The queryset used for retrieving the existing categories.
    """

    serializer_class = CategoryCreateSerializer
    queryset = Category.objects.all()
