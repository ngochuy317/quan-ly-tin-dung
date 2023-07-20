from django.urls import path

from .views import CreditCardAPIView


urlpatterns = [
    path('creditcards/', CreditCardAPIView.as_view(), name="creditcards"),
]