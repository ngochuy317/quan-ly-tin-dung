# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.urls import path
from .views import (
    BillPosListAPIView,
    FeePos4CreditCardDetailRetrieveUpdateDestroyAPIView,
    FeePos4CreditCardListCreateAPIView,
    POSNickNameAPIView,
    StoreMakePOSDetailRetrieveUpdateDestroyAPIView,
    StoreMakePOSListAPIViewNoPagination,
    StoreMakePOSListCreateAPIView,
)


urlpatterns = [
    path("bill-pos/", BillPosListAPIView.as_view(), name="get-bill-pos"),
    path("nick-name-pos/", POSNickNameAPIView.as_view(), name="nick-name-pos"),
    path("stores-make-pos/", StoreMakePOSListCreateAPIView.as_view(), name="stores-make-pos"),
    path("stores-make-pos/nopagination/", StoreMakePOSListAPIViewNoPagination.as_view(), name="stores-make-pos"),
    path(
        "stores-make-pos/<pk>/", StoreMakePOSDetailRetrieveUpdateDestroyAPIView.as_view(), name="stores-make-pos-detail"
    ),
    path("fee-4-pos-creditcard/", FeePos4CreditCardListCreateAPIView.as_view(), name="fee-4-pos-creditcard"),
    path(
        "fee-4-pos-creditcard/<pk>/",
        FeePos4CreditCardDetailRetrieveUpdateDestroyAPIView.as_view(),
        name="fee-4-pos-creditcard-detail",
    ),
]
