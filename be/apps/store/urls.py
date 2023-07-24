# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.urls import path
from .views import (
    BillPosListAPIView,
    StoreMakePOSDetailRetrieveUpdateDestroyAPIView,
    StoreMakePOSListAPIViewNoPagination,
    StoreMakePOSListCreateAPIView,
)


urlpatterns = [
    path("bill-pos/", BillPosListAPIView.as_view(), name="get-bill-pos"),
    path("stores-make-pos/", StoreMakePOSListCreateAPIView.as_view(), name="stores-make-pos"),
    path("stores-make-pos/nopagination/", StoreMakePOSListAPIViewNoPagination.as_view(), name="stores-make-pos"),
    path(
        "stores-make-pos/<pk>/", StoreMakePOSDetailRetrieveUpdateDestroyAPIView.as_view(), name="stores-make-pos-detail"
    ),
]
