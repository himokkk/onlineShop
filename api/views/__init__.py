from .category import CategoryCreateView, CategoryListView
from .login import LoginView, RegisterView, admin_logout_view
from .product import ProductCreateView, ProductListView, ProductRetrieveView
from .user import UserCreateView, UserListView, LoggedUserView, UserView
from .review import ReviewListView, ReviewCreateView

__all__ = [
    "LoginView",
    "RegisterView",
    "CategoryListView",
    "CategoryCreateView",
    "ProductCreateView",
    "ProductListView",
    "ProductRetrieveView",
    "UserView",
    "UserListView",
    "UserCreateView",
    "admin_logout_view",
    "LoggedUserView",
    "ReviewListView",
    "ReviewCreateView"
]
