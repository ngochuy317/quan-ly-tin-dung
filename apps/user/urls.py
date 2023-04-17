from django.urls import path

from .views import LogInView, LogOutView

urlpatterns = [
    path('login/', LogInView.as_view(), name="login"),
    path('logout/', LogOutView.as_view(), name="logout"),
]
