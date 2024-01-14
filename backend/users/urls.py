from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from users.views import RegisterView, UserView, UserListView, LoggedUserView, ChangeUserImageView, PasswordResetView, \
    CartAddView, CartRemoveView

urlpatterns = [
    path("login/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("signup/", RegisterView.as_view()),
    path("<pk>", UserView.as_view()),
    path("list/", UserListView.as_view()),
    path("current/", LoggedUserView.as_view()),
    path("avatar_change/", ChangeUserImageView.as_view()),
    path("reset_password/", PasswordResetView.as_view()),
    path("cart/add/", CartAddView.as_view()),
    path("cart/remove/", CartRemoveView.as_view()),
    # path("message/create/", MessageCreateView.as_view()),
    # path("message/list/<pk>", MessageListView.as_view()),
]