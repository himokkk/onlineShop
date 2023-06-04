from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, UpdateAPIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from ..models import Review, Order, UserProfile
from ..serializers import ReviewCreateSerializer, ReviewSerializer


class ReviewListView(ListAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()


class ReviewUpdateView(UpdateAPIView):
    def put(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        user_instance = get_object_or_404(Token, key=auth_header).user
        user_profile_instance = get_object_or_404(UserProfile, user=user_instance)

        product_id = request.data.get("product", None)
        review = get_object_or_404(Review, product=product_id, owner=user_profile_instance)
        serializer = ReviewSerializer(review, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
