from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied


class TokenProvidedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        token = request.data.get("token")
        if token is None:
            raise PermissionDenied("Token not found in request data")
        return True
