from django.urls import path

from .views import (
    CategoryListView,
    LoginView,
    ProductCreateView,
    ProductListView,
    RegisterView,
    UserListView,
    UserView,
    admin_logout_view,
    LoggedUserView,
)

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("logout/", admin_logout_view),
    path("register/", RegisterView.as_view()),
    path("user/<pk>", UserView.as_view()),
    path("user/list", UserListView.as_view()),
    path("user/current/", LoggedUserView.as_view()),
    path("product/list/", ProductListView.as_view()),
    path("product/create/", ProductCreateView.as_view()),
    path("category/list/", CategoryListView.as_view()),
]
