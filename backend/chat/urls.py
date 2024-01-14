from django.urls import path

from chat.views import MessageCreateView, MessageListView

urlpatterns = [
    path("message/create/", MessageCreateView.as_view()),
    path("message/list/<pk>", MessageListView.as_view()),
]
