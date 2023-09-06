# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.urls import path
from .views import (
    CreditCardAPIView,
    CreditCardRetrieveUpdateDestroyAPIView,
    CustomerListAPIView,
    CustomerListAPIViewNoPagination,
    CustomerRetrieveUpdateDestroyAPIView,
)


urlpatterns = [
    path("", CustomerListAPIView.as_view(), name="customers"),
    path("no-pagination/", CustomerListAPIViewNoPagination.as_view(), name="customers-no-pagination"),
    path("creditcards/", CreditCardAPIView.as_view(), name="creditcards"),
    path("<pk>/", CustomerRetrieveUpdateDestroyAPIView.as_view(), name="retrive-update-customer"),
    path("creditcard/<pk>/", CreditCardRetrieveUpdateDestroyAPIView.as_view(), name="creditcard-detail"),
]
