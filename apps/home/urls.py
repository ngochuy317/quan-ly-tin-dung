from django.urls import path

from .views import (
    Index,
    SwipeCard,
    Test,
)

urlpatterns = [
    path('', Index.as_view(), name="index"),
    path('swipecard/', SwipeCard.as_view(), name="swipecard"),
    path('test/', Test.as_view(), name="test"),
]