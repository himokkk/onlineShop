from django.contrib.auth import logout
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from users.models import UserProfile
from users.serializers import UserProfileSerializer, UserSerializer


class LoggedUserView(APIView):
    """API view for retrieving the profile of the logged-in user.
    Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs) -> Response:
        user_profile = request.user.profile
        data = UserProfileSerializer(user_profile).data
        return Response(data)


class UserView(RetrieveAPIView):
    """
    API view for retrieving user profile.

    Inherits from RetrieveAPIView class.
    Requires authentication for access.
    Uses UserProfileSerializer for serialization.
    Retrieves UserProfile objects from the database.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def get(self, request: Request, pk: int) -> Response:
        """Retrieves the user profile with the specified primary key.

        Args:
            request (HttpRequest): The HTTP request object.
            pk (int): The primary key of the user profile.

        Returns:
            Response: The serialized user profile data with an additional "owner" field indicating if the profile belongs to the requesting user.
        """
        user_profile = UserProfile.objects.get(pk=pk)
        data = UserProfileSerializer(user_profile).data

        owner = request.user.profile == user_profile
        data.update({"owner": owner})
        return Response(data)


class UserListView(ListAPIView):
    """A view that returns a list of user profiles.

    Inherits from ListAPIView and uses UserProfileSerializer
    as the serializer class. The queryset is set to retrieve
    all UserProfile objects.
    """

    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()


class UserCreateView(CreateAPIView):
    """View for creating a new user profile.

    Inherits from CreateAPIView which provides the default implementation
    for creating a new object using a serializer.

    serializer_class: The serializer class to use for validating and
                      deserializing the input data.
    queryset: The queryset to use when retrieving the list of objects.
              In this case, it retrieves all user profiles.
    """

    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()


class ChangeUserImageView(APIView):
    """API view for changing the user's profile image.

    This view allows authenticated users to upload a new profile image.
    The image file should be sent as a part of the request data with the key "image".

    Returns a JSON response with a success message if the image is changed successfully,
    or an error message if no image is provided.

    Methods:
    - put: Handles the PUT request for changing the user's profile image.
    """

    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def put(self, request: Request, *args, **kwargs) -> Response:
        user_profile = request.user.profile

        image_file = request.FILES.get("image")
        if image_file:
            user_profile.image = image_file
            user_profile.save()
            return Response({"message": "Image changed successfully"})
        else:
            return Response({"message": "No image provided"}, status=400)


class PasswordResetView(APIView):
    pass
    # def put(self, request, hash):
    #     new_password = request.data.get("password", None)
    #     if not new_password:
    #         return Response(status=404)
    #
    #     hash_instance = get_object_or_404(Hash, hash=hash)
    #     user_instance = hash_instance.user
    #     user_instance.set_password(new_password)
    #     user_instance.save()
    #     hash_instance.delete()
    #     return Response(status=200)


class RegisterView(CreateAPIView):
    """View for registering a new user.

    Inherits from CreateAPIView which provides the functionality for creating a new object.
    """

    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = request.data.get("password")
        user_instance = serializer.save()
        user_instance.set_password(password)
        user_instance.save()
        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED,
        )


def admin_logout_view(request):
    """Logs out the admin user and deletes the token cookie.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: A redirect response to the home page.
    """
    logout(request)
    response = redirect("/#")
    response.delete_cookie("token")
    return response


class CartAddView(APIView):
    """API view for adding a product to the user's cart.

    Requires authentication.

    Request Parameters:
        - item: The ID of the product to be added to the cart.

    Returns:
        - Response: The serialized user profile data after adding the product to the cart.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def post(self, request: Request, *args, **kwargs) -> Response:
        item = request.data.get("item", None)
        if not item:
            return Response(
                {"message": "Product not provided"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        user_profile = request.user.profile
        product_instance = Product.objects.get(pk=int(item))
        user_profile.cart.add(product_instance)

        return Response(self.serializer_class(user_profile).data)


class CartRemoveView(APIView):
    """API view for removing an item from the user's cart.

    Requires authentication.

    Request Parameters:
        - item: The ID of the product to be removed from the cart.

    Returns:
        - If the item is successfully removed, returns the updated user profile data.
        - If the item is not provided, returns a 401 Unauthorized response with an error message.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()

    def post(self, request: Request, *args, **kwargs) -> Response:
        """Handle POST requests to remove a product from the user's cart.

        Args:
            request (HttpRequest): The HTTP request object.

        Returns:
            Response: The response containing the serialized user profile data.

        Raises:
            Product.DoesNotExist: If the specified product does not exist.
        """
        item = request.data.get("item", None)
        if not item:
            return Response(
                {"message": "Product not provided"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        product_instance = Product.objects.get(pk=int(item))
        user_profile = request.user.profile
        user_profile.cart.remove(product_instance)

        return Response(self.serializer_class(user_profile).data)
