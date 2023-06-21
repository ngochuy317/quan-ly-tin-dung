from django.shortcuts import render
from django.views import View
from django.db.models import Q, Sum

import pytz
from datetime import datetime

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
    ListCreateAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FileUploadParser, MultiPartParser

from apps.store.models import (
    Store,
    StoreCost,
    POS,
    SwipeCardTransaction,
    CreditCard,
    NoteBook,
    RowNotebook,
    Customer,
    Product,
)
from apps.user.models import User
from apps.user.authentication import IsAdmin

from datetime import datetime
from nested_multipart_parser import NestedParser

from .filters import SwipeCardTransactionFilter
from .serializers import (
    UserSerializer,
    StoreSerializer,
    StoreCostSerializer,
    POSSerializer,
    NoteBookSerializer,
    CustomerSerializer,
    CreditCardSerializer,
    ProductSerializer,
    SwipeCardTransactionSerializer,
    RowNotebookSerializer,
)
from .pagination import CustomPageNumberPagination, SwipeCardTransactionPageNumberPagination


class SwipeCardView(View):

    def get(self, request, *args, **kwargs):
        store_id = request.user.infomation_detail.store.id
        store = Store.objects.filter(id=store_id).first()
        context = {
            "sidebar": "swipecard",
            "store": store,
        }
        return render(request, "home/swipe_card.html", context)

    def post(self, request, *args, **kwargs):
        store_id = request.user.infomation_detail.store.id
        store = Store.objects.filter(id=store_id).first()
        context = {
            "sidebar": "swipecard"
        }
        data = {
            "customer_code": request.POST.get("customer_code"),
            "customer_name": request.POST.get("customer_name"),
            "phone_number": request.POST.get("phone_number"),
            "customer_gender": request.POST.get("customer_gender"),
            "customer_money_needed": request.POST.get("customer_money_needed"),
            "customer_account": request.POST.get("customer_account"),
            "customer_bank_account": request.POST.get("customer_bank_account"),
            "line_of_credit": request.POST.get("line_of_credit"),
            "fee": request.POST.get("fee"),
            "at_store": store,
        }
        try:
            user: User = User.objects.filter(id=request.user.id).first()
            data["user"] = user
            credit_card_data = {
                "card_number": request.POST.get("card_number"),
                "card_bank_name": request.POST.get("card_bank_name"),
                "card_name": request.POST.get("card_name"),
                "card_issued_date": "",
                "card_expire_date": "",
                "card_ccv": request.POST.get("card_ccv"),
                "statement_date": "",
                "maturity_date": "",
            }
            card_issued_date_datetime_object = datetime.strptime(request.POST.get("card_issued_date"), "%Y-%m-%d")
            card_expire_date_datetime_object = datetime.strptime(request.POST.get("card_expire_date"), "%Y-%m-%d")
            statement_date_datetime_object = datetime.strptime(request.POST.get("statement_date"), "%Y-%m-%d")
            maturity_date_datetime_object = datetime.strptime(request.POST.get("maturity_date"), "%Y-%m-%d")
            credit_card_data["card_issued_date"] = card_issued_date_datetime_object
            credit_card_data["card_expire_date"] = card_expire_date_datetime_object
            credit_card_data["statement_date"] = statement_date_datetime_object
            credit_card_data["maturity_date"] = maturity_date_datetime_object

            credit_card = CreditCard.objects.create(**credit_card_data)
            data["creditcard"] = credit_card
            SwipeCardTransaction.objects.create(**data)
        except ValueError as e:
            print(e)

        return render(request, "home/swipe_card.html", context)


class ProductRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdmin]


class ProductListCreateAPIView(ListCreateAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]


class SwipeCardTransactionDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = SwipeCardTransaction.objects.all()
    serializer_class = SwipeCardTransactionSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        print("parser", parser)
        if parser.is_valid():
            data = parser.validate_data
            partial = True
            instance = self.get_object()
            print("data", data)
            serializer = SwipeCardTransactionSerializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response("Parser error", status=status.HTTP_400_BAD_REQUEST)


class SwipeCardTransactionAPIView(ListAPIView):

    permission_classes = [IsAuthenticated]
    pagination_class = SwipeCardTransactionPageNumberPagination
    filterset_class = SwipeCardTransactionFilter
    queryset = SwipeCardTransaction.objects.all()
    serializer_class = SwipeCardTransactionSerializer

    def post(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            request.data["user"] = request.user.id
            data["user"] = request.user.id
            serializer = SwipeCardTransactionSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response("Parser error", status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.role != "admin":
            qs = qs.filter(user=self.request.user.id)
        return qs


class CreditCardAPIView(APIView):
    parser_classes = [MultiPartParser, FileUploadParser]

    def post(self, request, *args, **kwargs):
        serializer = CreditCardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        data = CreditCard.objects.all()
        serializer = CreditCardSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerAPIView(APIView):

    parser_classes = [MultiPartParser, ]
    serializer_class = CustomerSerializer
    # permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        data = Customer.objects.all()
        serializer = CustomerSerializer(data, many=True)
        # serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NotebookListCreateAPIView(ListCreateAPIView):

    queryset = NoteBook.objects.all()
    serializer_class = NoteBookSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]


class NoteBookDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = NoteBook.objects.all()
    serializer_class = NoteBookSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        obj = NoteBook.objects.filter(id=id).first()
        serializer = NoteBookSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class POSListCreateAPIView(ListCreateAPIView):

    queryset = POS.objects.all()
    serializer_class = POSSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]


class POSDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = POS.objects.all()
    serializer_class = POSSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        obj = POS.objects.filter(id=id).first()
        serializer = POSSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class StoreCostCreateAPIView(ListCreateAPIView):

    queryset = StoreCost.objects.all()
    serializer_class = StoreCostSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]


class StoreCostListAPIViewNoPagination(ListAPIView):

    queryset = StoreCost.objects.all()
    serializer_class = StoreCostSerializer
    permission_classes = [IsAdmin]


class StoreListCreateAPIView(ListCreateAPIView):

    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]


class StoreListAPIViewNoPagination(ListAPIView):

    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdmin]


class StoreDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        obj = Store.objects.filter(id=id).first()
        serializer = StoreSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class EmployeesListCreateAPIView(ListCreateAPIView):

    queryset = User.objects.filter(~Q(role="admin"))
    serializer_class = UserSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]


class EmployeeDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = User.objects.filter(~Q(role="admin"))
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        obj = User.objects.filter(id=id).first()
        print(request.data)
        serializer = UserSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class InformationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        store = Store.objects.filter(id=request.user.infomation_detail.store.id).first()
        serializer = StoreSerializer(store)
        context = {
            "store": serializer.data
        }
        return Response(context, status=status.HTTP_200_OK)


class RowNotebookAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            serializer = RowNotebookSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response("Parser error", status=status.HTTP_400_BAD_REQUEST)


class RowNotebookListAPIView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        if id:
            data = RowNotebook.objects.filter(notebook__id=id)
            pagination = CustomPageNumberPagination()
            data = pagination.paginate_queryset(data, request, view=self)
            serializer = RowNotebookSerializer(data, many=True)
            return pagination.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UnsaveCreditCardByStoreAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        swipe_card_transactions = SwipeCardTransaction.objects.filter(
            store_id=request.user.infomation_detail.store.id,
            creditcard__notebook__isnull=True
        )
        creditcards = [x.creditcard for x in swipe_card_transactions]
        serializer = CreditCardSerializer(creditcards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TotalMoneyTodayAPIView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        today = datetime.now(tz=pytz.timezone("Asia/Saigon"))
        total_money = SwipeCardTransaction.objects.filter(transaction_datetime__date=today)\
            .aggregate(Sum('customer_money_needed'))['customer_money_needed__sum']
        context = {
            "total_money": total_money,
        }
        return Response(context, status=status.HTTP_200_OK)
