from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from users.views import admin_logout_view

urlpatterns = [
    path("admin/logout/", admin_logout_view),
    path("admin/", admin.site.urls),
    path("categories/", include("categories.urls")),
    path("orders/", include("orders.urls")),
    path("products/", include("products.urls")),
    path("users/", include("users.urls")),
    path("chat/", include("users.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
