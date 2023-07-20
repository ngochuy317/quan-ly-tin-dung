from django_filters import rest_framework as filters


class CreditCardFilter(filters.FilterSet):
    card_number = filters.CharFilter(lookup_expr="startswith")
