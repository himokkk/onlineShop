from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Review
from ..serializers import ReviewSerializer


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
