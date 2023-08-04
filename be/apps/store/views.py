# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.base.constants import PARSE_ERROR_MSG
from apps.home.pagination import CustomPageNumberPagination
from apps.user.authentication import IsAdmin
from nested_multipart_parser import NestedParser
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from .filters import BillPosFilter
from .models import POS, BillPos, FeePos4CreditCard, StoreMakePOS
from .serializers import (
    BillPosSerializer,
    FeePos4CreditCardSerializer,
    POSNickNameAPIViewSerializer,
    StoreMakePOSSerializer,
)


class BillPosListAPIView(ListAPIView):
    filterset_class = BillPosFilter
    serializer_class = BillPosSerializer
    pagination_class = CustomPageNumberPagination
    queryset = BillPos.objects.all()


class BillPosRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = BillPos.objects.all()

    def patch(self, request, *args, **kwargs):

        partial = True
        instance = self.get_object()
        serializer = BillPosSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)


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


class FeePos4CreditCardListCreateAPIView(ListCreateAPIView):

    queryset = FeePos4CreditCard.objects.all()
    serializer_class = FeePos4CreditCardSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]


class FeePos4CreditCardDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = FeePos4CreditCard.objects.all()
    serializer_class = FeePos4CreditCardSerializer
    permission_classes = [IsAdmin]


class POSNickNameAPIView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):

        data = POS.objects.values(
            "id",
            "name",
            "bank_account",
            "bank_name",
        ).all()
        serializer = POSNickNameAPIViewSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
