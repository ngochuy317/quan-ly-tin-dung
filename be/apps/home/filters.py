# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django_filters import rest_framework as filters


class SwipeCardTransactionFilter(filters.FilterSet):
    store_id = filters.NumberFilter()
    pos = filters.NumberFilter()
    transaction_datetime_created = filters.DateFilter(method="transaction_datetime_created_filter")
    user = filters.NumberFilter(method="user_filter")

    def transaction_datetime_created_filter(self, queryset, name, value):
        return queryset.filter(transaction_datetime_created__date=value)

    def user_filter(self, queryset, name, value):
        return queryset.filter(user=value)


class NotebookFilter(filters.FilterSet):
    store_id = filters.NumberFilter(field_name="store__id")
