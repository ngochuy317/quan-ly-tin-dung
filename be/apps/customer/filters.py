# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django_filters import rest_framework as filters


class CreditCardFilter(filters.FilterSet):
    card_number = filters.CharFilter(lookup_expr="startswith")
