# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.urls import path
from .views import CreditCardAPIView


urlpatterns = [
    path("creditcards/", CreditCardAPIView.as_view(), name="creditcards"),
]
