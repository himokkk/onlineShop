from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response

from ..models import Review
from ..serializers import ReviewSerializer, ReviewCreateSerializer


class ReviewListView(ListAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()


class ReviewCreateView(CreateAPIView):
    serializer_class = ReviewCreateSerializer
    queryset = Review.objects.all()

    def post(self, request):
        result = super().post(request)
        print(request.data.get("token", None))
        print(request.user)
        return result
