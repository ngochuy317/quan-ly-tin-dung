# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.urls import path
from .views import BillPosListAPIView


urlpatterns = [
    path("bill-pos/", BillPosListAPIView.as_view(), name="get-bill-pos"),
]
