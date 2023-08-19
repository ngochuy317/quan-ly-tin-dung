# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.user.authentication import IsAdmin
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from .filters import CreditCardFilter
from .models import CreditCard
from .serializers import CreditCardCustomSerializer, CreditCardRetriveUpdateDeleteSerializer


class CreditCardAPIView(ListAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    filterset_class = CreditCardFilter
    serializer_class = CreditCardCustomSerializer
    queryset = CreditCard.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def post(self, request, *args, **kwargs):
        serializer = CreditCardCustomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response(response.data[:5], status=response.status_code)


class CreditCardRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = CreditCard.objects.all()
    serializer_class = CreditCardRetriveUpdateDeleteSerializer
    permission_classes = [IsAdmin]
