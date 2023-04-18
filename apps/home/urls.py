from django.urls import path

from .views import (
    HomeView,
    SwipeCardView,
    StoreView,
    StoreDetailView,
    StoresView,
    Test,
)

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    path('swipecard/', SwipeCardView.as_view(), name="swipecard"),
    path('add_store/', StoreView.as_view(), name="add_store"),
    path('stores/', StoresView.as_view(), name="stores"),
    path('stores/<pk>/', StoreDetailView.as_view(), name="store-detail"),
    path('test/', Test.as_view(), name="test"),
]