from django.urls import path

from .views import LogOutView, UserLoginView

urlpatterns = [
    path('api/login/', UserLoginView.as_view(), name="login"),
    path('logout/', LogOutView.as_view(), name="logout"),
]
