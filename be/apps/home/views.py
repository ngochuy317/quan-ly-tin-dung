# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from datetime import datetime

import pytz
from apps.base.constants import ADMIN, PARSE_ERROR_MSG, Y_M_D_FORMAT
from apps.customer.models import CreditCard
from apps.store.models import POS, BillPos, NoteBook, Product, RowNotebook, Store, StoreCost, SwipeCardTransaction
from apps.store.serializers import FeePos4CreditCardSerializer
from apps.user.authentication import IsAdmin
from apps.user.models import User
from django.db.models import Q, Sum
from django.shortcuts import render
from django.views import View
from nested_multipart_parser import NestedParser
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .filters import CreditCardManagementFilter, NotebookFilter, SwipeCardTransactionFilter
from .pagination import (
    CustomPageNumberPagination,
    CustomPageNumberPaginationPageSize15,
    SwipeCardTransactionPageNumberPagination,
)
from .serializers import (
    AllTransaction4CreditCardSerializer,
    BillPosSerializer,
    BillPosUpdateSerializer,
    CreateRowNotebookSerializer,
    CreditCardManagementSerializer,
    GetRowNotebookSerializer,
    NoteBookSerializer,
    POSSerializer,
    POSSerializerDetail,
    ProductSerializer,
    StoreCostSerializer,
    StoreInformationDetailSerializer,
    StorePOSOnlySerializer,
    StoreSerializer,
    SwipeCardTransactionDetailRetrieveUpdateSerializer,
    SwipeCardTransactionReportSerializer,
    SwipeCardTransactionSerializer,
    UserSerializer,
)


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
        context = {"sidebar": "swipecard"}
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
            card_issued_date_datetime_object = datetime.strptime(request.POST.get("card_issued_date"), Y_M_D_FORMAT)
            card_expire_date_datetime_object = datetime.strptime(request.POST.get("card_expire_date"), Y_M_D_FORMAT)
            statement_date_datetime_object = datetime.strptime(request.POST.get("statement_date"), Y_M_D_FORMAT)
            maturity_date_datetime_object = datetime.strptime(request.POST.get("maturity_date"), Y_M_D_FORMAT)
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
    serializer_class = SwipeCardTransactionDetailRetrieveUpdateSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            billpos = data.pop("billpos", None)
            partial = True
            instance = self.get_object()
            serializer = SwipeCardTransactionDetailRetrieveUpdateSerializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            self.update_or_create_bill_pos_data(serializer.data.get("id"), billpos)
            return Response(status=status.HTTP_200_OK)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)

    def update_or_create_bill_pos_data(self, swipe_trasaction_id: int, billposes: list):
        if not all([swipe_trasaction_id, billposes]):
            return
        for billpos in billposes:
            try:
                billpos["pos"] = billpos.get("pos", {}).get("id")
                if billpos.get("exist", False) == "true":
                    obj_billposes = BillPos.objects.filter(id=billpos.get("id")).first()
                    if obj_billposes:
                        serializer = BillPosUpdateSerializer(obj_billposes, data=billpos)
                        serializer.is_valid(raise_exception=True)
                        serializer.save()
                else:
                    billpos.update({"transaction": swipe_trasaction_id})
                    serializer = BillPosSerializer(data=billpos)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
            except Exception as e:
                print(e)


class SwipeCardTransactionReportAPIView(ListAPIView):
    permission_classes = [IsAdmin]
    pagination_class = SwipeCardTransactionPageNumberPagination
    filterset_class = SwipeCardTransactionFilter
    queryset = SwipeCardTransaction.objects.all()
    serializer_class = SwipeCardTransactionReportSerializer


class SwipeCardTransactionAPIView(ListAPIView):

    permission_classes = [IsAuthenticated]
    pagination_class = SwipeCardTransactionPageNumberPagination
    # filterset_class = SwipeCardTransactionFilter
    queryset = SwipeCardTransaction.objects.all()
    serializer_class = SwipeCardTransactionSerializer

    def post(self, request, *args, **kwargs):

        # try:
        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            data["user"] = request.user.id
            billpos_datas = data.pop("billpos")
            serializer = SwipeCardTransactionSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            swipe_card_transaction_id = serializer.data.get("id")
            for billpos_data in billpos_datas:
                billpos_data["transaction"] = swipe_card_transaction_id
            billpos_serializer = BillPosSerializer(data=billpos_datas, many=True)
            billpos_serializer.is_valid(raise_exception=True)
            billpos_serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)
        # except Exception as e:
        #     print("Exception SwipeCardTransactionAPIView", e)
        #     return Response(e, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.filter(is_creditcard_stored=False)
        if self.request.user.role != ADMIN:
            qs = qs.filter(user=self.request.user.id)
        return qs


class AllTransaction4CreditCardAPIView(APIView):

    # permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        card_number = kwargs.get("card_number")
        if card_number:
            data = SwipeCardTransaction.objects.filter(creditcard__card_number=card_number).values(
                "store_name", "customer_money_needed", "transaction_datetime_created"
            )

            serializer = AllTransaction4CreditCardSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CreditCardManagementAPIView(ListAPIView):

    serializer_class = CreditCardManagementSerializer
    pagination_class = CustomPageNumberPaginationPageSize15
    permission_classes = [IsAdmin]
    filterset_class = CreditCardManagementFilter

    def get_queryset(self):
        swipe_card_ids = (
            SwipeCardTransaction.objects.order_by("creditcard__card_number", "-transaction_datetime_created")
            .distinct("creditcard__card_number")
            .values("id")
        )
        swipe_card_list_qs = (
            SwipeCardTransaction.objects.filter(id__in=swipe_card_ids)
            .order_by("-transaction_datetime_created")
            .values(
                "id",
                "store_name",
                "creditcard__card_number",
                "creditcard__id",
                "customer_money_needed",
                "transaction_datetime_created",
            )
        )
        return swipe_card_list_qs


class NotebookListCreateAPIView(ListCreateAPIView):

    queryset = NoteBook.objects.all()
    serializer_class = NoteBookSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]
    filterset_class = NotebookFilter


class NotebookListAPIViewNoPagination(ListAPIView):

    queryset = NoteBook.objects.all()
    serializer_class = NoteBookSerializer
    permission_classes = [IsAdmin]
    filterset_class = NotebookFilter


class NoteBookDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = NoteBook.objects.all()
    serializer_class = NoteBookSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        _id = kwargs.get("pk")
        obj = NoteBook.objects.filter(id=_id).first()
        serializer = NoteBookSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class POSListCreateAPIView(ListCreateAPIView):

    queryset = POS.objects.all()
    serializer_class = POSSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]

    def post(self, request, *args, **kwargs):

        data = request.data
        feepos = data.pop("fee4creditcard", None)
        serializer = POSSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        _pos_id = serializer.data["id"]

        for x in feepos:
            x["pos_machine"] = _pos_id
        serializer_feepos = FeePos4CreditCardSerializer(data=feepos, many=True)
        serializer_feepos.is_valid(raise_exception=True)
        serializer_feepos.save()
        return Response(status=status.HTTP_200_OK)


class POSDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = POS.objects.all()
    serializer_class = POSSerializerDetail
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        _id = kwargs.get("pk")
        obj = POS.objects.filter(id=_id).first()
        serializer = POSSerializerDetail(obj, data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # return Response(status=status.HTTP_400_BAD_REQUEST)
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

    def post(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            serializer = StoreSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)


class StoreListAPIViewNoPagination(ListAPIView):

    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdmin]


class StoreDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            _id = kwargs.get("pk")
            obj = Store.objects.filter(id=_id).first()
            serializer = StoreSerializer(obj, data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)


class StorePOSOnlyRetrieveAPIView(RetrieveAPIView):

    queryset = Store.objects.all()
    serializer_class = StorePOSOnlySerializer
    permission_classes = [IsAuthenticated]


class EmployeesListCreateAPIView(ListCreateAPIView):

    queryset = User.objects.filter(~Q(role=ADMIN))
    serializer_class = UserSerializer
    pagination_class = CustomPageNumberPagination
    permission_classes = [IsAdmin]

    def post(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            serializer = UserSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = User.objects.filter(~Q(role=ADMIN))
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def put(self, request, *args, **kwargs):
        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            _id = kwargs.get("pk")
            obj = User.objects.filter(id=_id).first()
            serializer = UserSerializer(obj, data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)


class InformationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        store = Store.objects.filter(id=request.user.infomation_detail.store.id).first()
        serializer = StoreInformationDetailSerializer(store)
        context = {"store": serializer.data}
        return Response(context, status=status.HTTP_200_OK)


class RowNotebookAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        parser = NestedParser(request.data)
        if parser.is_valid():
            data = parser.validate_data
            serializer = CreateRowNotebookSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(PARSE_ERROR_MSG, status=status.HTTP_400_BAD_REQUEST)


class RowNotebookListAPIView(APIView):

    # permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        _id = kwargs.get("pk")
        if _id:
            data = RowNotebook.objects.filter(notebook__id=_id)
            pagination = CustomPageNumberPagination()
            data = pagination.paginate_queryset(data, request, view=self)
            serializer = GetRowNotebookSerializer(data, many=True)
            return pagination.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class TotalMoneyTodayAPIView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        today = datetime.now(tz=pytz.timezone("Asia/Saigon"))
        total_money = SwipeCardTransaction.objects.filter(transaction_datetime_created__date=today).aggregate(
            Sum("customer_money_needed")
        )["customer_money_needed__sum"]
        context = {
            "total_money": total_money,
        }
        return Response(context, status=status.HTTP_200_OK)
