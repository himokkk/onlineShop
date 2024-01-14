from django.urls import path

from categories.views import CategoryListView, CategoryCreateView

urlpatterns = [
    path("list/", CategoryListView.as_view()),
    path("create/", CategoryCreateView.as_view()),
]