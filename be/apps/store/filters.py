# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django_filters import rest_framework as filters


class BillPosFilter(filters.FilterSet):
    store_id = filters.NumberFilter(method="store_id_filter")
    pos = filters.NumberFilter()
    datetime_created = filters.DateFilter(method="datetime_created_filter")

    def store_id_filter(self, queryset, name, value):
        return queryset.filter(pos__store__id=value)

    def datetime_created_filter(self, queryset, name, value):
        return queryset.filter(datetime_created__date=value)
