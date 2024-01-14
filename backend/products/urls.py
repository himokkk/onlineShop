from django.urls import path

from products.views import ReviewListView, ReviewUpdateView
from products.views import ProductListView, ProductCreateView, ProductRetrieveView

urlpatterns = [
    path("list/", ProductListView.as_view()),
    path("create/", ProductCreateView.as_view()),
    path("<pk>", ProductRetrieveView.as_view()),
    path("review/list/", ReviewListView.as_view()),
    path("review/update/", ReviewUpdateView.as_view()),
]