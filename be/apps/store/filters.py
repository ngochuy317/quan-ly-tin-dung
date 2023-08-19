# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django_filters import rest_framework as filters


class BillPosFilter(filters.FilterSet):
    store_id = filters.NumberFilter(method="store_id_filter")
    pos = filters.NumberFilter()
    # Use with datetime_created_after and datetime_created_before parameters
    datetime_created = filters.DateFromToRangeFilter()
    receive_money = filters.BooleanFilter()
    valid = filters.BooleanFilter()

    def store_id_filter(self, queryset, name, value):
        return queryset.filter(pos__store__id=value)
