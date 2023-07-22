from django.urls import path

from .views import BillPosListAPIView


urlpatterns = [
    path('bill-pos/', BillPosListAPIView.as_view(), name="get-bill-pos"),
]