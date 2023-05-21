from django.urls import path

from .views import (CartAddView, CartRemoveView, CategoryCreateView,
                    CategoryListView, LoggedUserView, LoginView,
                    OrderCreateView, OrderListView, OrderRetrieveView,
                    OrderStatusView, ProductCreateView, ProductListView,
                    ProductRetrieveView, RegisterView, ReviewCreateView, ChangeUserImageView,
                    ReviewListView, UserListView, UserView, admin_logout_view, PasswordResetView, GetPasswordResetHashView)

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("logout/", admin_logout_view),
    path("signup/", RegisterView.as_view()),
    path("user/<pk>", UserView.as_view()),
    path("user/list/", UserListView.as_view()),
    path("user/current/", LoggedUserView.as_view()),
    path("user/avatar_change/", ChangeUserImageView.as_view()),
    path("user/reset_password/<hash>", PasswordResetView.as_view()),
    path("user/reset_password/", GetPasswordResetHashView.as_view()),
    path("cart/add/", CartAddView.as_view()),
    path("cart/remove/", CartRemoveView.as_view()),
    path("product/list/", ProductListView.as_view()),
    path("product/create/", ProductCreateView.as_view()),
    path("product/<pk>", ProductRetrieveView.as_view()),
    path("category/list/", CategoryListView.as_view()),
    path("category/create/", CategoryCreateView.as_view()),
    path("review/list/", ReviewListView.as_view()),
    path("review/create/", ReviewCreateView.as_view()),
    path("order/list/", OrderListView.as_view()),
    path("order/<pk>", OrderRetrieveView.as_view()),
    path("order/create/", OrderCreateView.as_view()),
    path("order/status/<pk>", OrderStatusView.as_view()),
]
