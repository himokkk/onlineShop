from django.urls import path

from orders.views import OrderListView, OrderRetrieveView, OrderCreateView, OrderStatusView

urlpatterns = [
    path("list/", OrderListView.as_view()),
    path("<pk>", OrderRetrieveView.as_view()),
    path("create/", OrderCreateView.as_view()),
    path("status/<pk>", OrderStatusView.as_view())
]