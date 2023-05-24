from django_filters import rest_framework as filters


class SwipeCardTransactionFilter(filters.FilterSet):
    store_id = filters.NumberFilter()
    pos = filters.NumberFilter()
    transaction_datetime = filters.DateFilter(method="transaction_datetime_filter")

    def transaction_datetime_filter(self, queryset, name, value):
        return queryset.filter(transaction_datetime__date=value)
