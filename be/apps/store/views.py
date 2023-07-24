# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.base.constants import PARSE_ERROR_MSG
from apps.home.pagination import CustomPageNumberPagination
from apps.user.authentication import IsAdmin
from django.core.paginator import Paginator
from django.shortcuts import render
from django.views import View
from nested_multipart_parser import NestedParser
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from .filters import BillPosFilter
from .models import BillPos, StoreMakePOS, SwipeCardTransaction
from .serializers import BillPosSerializer, StoreMakePOSSerializer


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


class StoreMakePOSListAPIViewNoPagination(ListAPIView):

    queryset = StoreMakePOS.objects.all()
    serializer_class = StoreMakePOSSerializer
    permission_classes = [IsAdmin]


class StoreMakePOSListCreateAPIView(ListCreateAPIView):

    queryset = StoreMakePOS.objects.all()
    serializer_class = StoreMakePOSSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]

    def post(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            serializer = StoreMakePOSSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)


class StoreMakePOSDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = StoreMakePOS.objects.all()
    serializer_class = StoreMakePOSSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            _id = kwargs.get("pk")
            obj = StoreMakePOS.objects.filter(id=_id).first()
            serializer = StoreMakePOSSerializer(obj, data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)
