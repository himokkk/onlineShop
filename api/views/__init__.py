from .category import CategoryCreateView, CategoryListView
from .login import LoginView, RegisterView, admin_logout_view
from .product import ProductCreateView, ProductListView
from .user import UserCreateView, UserListView, LoggedUserView, UserView

__all__ = [
    "LoginView",
    "RegisterView",
    "CategoryListView",
    "CategoryCreateView",
    "ProductCreateView",
    "ProductListView",
    "UserView",
    "UserListView",
    "UserCreateView",
    "admin_logout_view",
    "LoggedUserView",
]
