from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path

urlpatterns = [
    path("admin/logout/", lambda request: redirect("/api/logout/", permanent=False)),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
