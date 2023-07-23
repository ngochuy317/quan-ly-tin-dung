# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.home.pagination import CustomPageNumberPagination
from django.core.paginator import Paginator
from django.shortcuts import render
from django.views import View
from rest_framework.generics import ListAPIView
from .filters import BillPosFilter
from .models import BillPos, SwipeCardTransaction
from .serializers import BillPosSerializer


class TransactionHistory(View):
    def get(self, request, *args, **kwargs):
        if request.user.role != "admin":
            transactions = SwipeCardTransaction.objects.filter(user__id=request.user.id).order_by(
                "-transaction_datetime_created"
            )
        else:
            transactions = SwipeCardTransaction.objects.all()
        paginator = Paginator(transactions, 15)
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)
        context = {
            "transactions": page_obj,
            "sidebar": "transaction-history",
        }
        return render(request, "home/transaction_history.html", context)


class BillPosListAPIView(ListAPIView):
    filterset_class = BillPosFilter
    serializer_class = BillPosSerializer
    pagination_class = CustomPageNumberPagination
    queryset = BillPos.objects.all()
