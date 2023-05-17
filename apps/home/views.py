
from django.contrib.auth.hashers import make_password
from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.views import View
from django.db.models import Q

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView

from apps.base.constants import ROLE_CHOICES
from apps.base.views import AdminRoleViewPermissionsMixin
from apps.store.models import Store, POS, SwipeCardTransaction, CreditCard, NoteBook
from apps.user.models import User, InfomationDetail

from datetime import datetime

from .serializers import UserSerializer, StoreSerializer, POSSerializer


class HomeView(View):

    def get(self, request, *args, **kwargs):
        return redirect("swipecard")
        # return render(request, "home/index.html")


class StoreCardStorageView(View):
    
    def get(self, request, *args, **kwargs):
        stores = Store.objects.all()
        context = {
            "sidebar": "storecard",
            "stores": stores,
        }
        return render(request, "home/cards_storage_store.html", context)

class StoreCardStorageDetailView(View):

    def get(self, request, *args, **kwargs):
        store_id = kwargs.get("store_id")
        if store_id != request.user.infomation_detail.store.id:
            return redirect("swipecard")
        store = Store.objects.filter(id=store_id).first()
        notebooks = store.notebooks.all()
        context = {
            "sidebar": "storecard",
            "store": store,
            "notebooks": notebooks,
        }
        return render(request, "home/cards_storage.html", context)


class StoreCardNotebookDetailView(View):

    def get(self, request, *args, **kwargs):
        id = kwargs.get("notebook_id")
        notebook = NoteBook.objects.filter(id=id).first()
        if notebook:
            creditcards = notebook.creditcards.all()
            paginator = Paginator(creditcards, 15)
            page_number = request.GET.get('page')
            page_obj = paginator.get_page(page_number)
            context = {
                "sidebar": "storecard",
                "notebook": notebook,
                "creditcards": page_obj,
            }
            return render(request, "home/card_storage.html", context)
        return redirect("storecard-store-detail")


class SwipeCardView(View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "swipecard",
        }
        return render(request, "home/swipe_card.html", context)
    
    def post(self, request, *args, **kwargs):
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
        }
        try:
            user: User = User.objects.filter(id=request.user.id).first()
            data["user"] = user
            credit_card_data = {
                "card_number": request.POST.get("card_number"),
                "card_bank_name": request.POST.get("card_bank_name"),
                 "card_name": request.POST.get("card_name"),
                "card_issued_date" : "",
                "card_expire_date" : "",
                "card_ccv": request.POST.get("card_ccv"),
                "statement_date" : "",
                "maturity_date" : "",
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


class StoreDetailView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        store = Store.objects.filter(id=pk).first()
        if store:
            context = {
                "store": store,
            }
            return render(request, "home/store.html", context)
        return redirect("stores")
    
    def post(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        store = Store.objects.filter(id=pk).first()
        data = {
            "code": request.POST.get("code"),
            "name": request.POST.get("name"),
            "phone_number": request.POST.get("phone_number"),
            "note": request.POST.get("note"),
            "address": request.POST.get("address"),
        }
        store.update(commit=True, **data)
        return redirect("stores")


class StoreDetailDeleteView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        store = Store.objects.filter(id=pk).first()
        if store:
            store.delete()
        return redirect("stores")


class EmployeeDetailDeleteView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        user = User.objects.filter(id=pk).first()
        if user:
            user.delete()
        return redirect("employees")


class StoreView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "stores",
        }
        return render(request, "home/add_store.html", context)
    
    def post(self, request, *args, **kwargs):
        valid_data = {
            "code" : request.POST.get("code"),
            "name" : request.POST.get("name"),
            "phone_number" : request.POST.get("phone_number"),
            "note" : request.POST.get("note"),
            "address" : request.POST.get("address"),
        }
        Store.objects.create(**valid_data)
        return redirect("stores")
    

class StoresView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        stores = Store.objects.all()
        paginator = Paginator(stores, 15)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {
            "stores": page_obj,
            "sidebar": "stores",
        }
        return render(request, "home/stores.html", context)


class EmployeeDetailView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        stores = Store.objects.all()
        user = User.objects.filter(id=pk).first()
        if user:
            context = {
                "user": user,
                "stores": stores,
                "roles": ROLE_CHOICES,
            }
            return render(request, "home/employee.html", context)
        return redirect("employees")
    
    def post(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        user: User = User.objects.filter(id=pk).first()
        info_detail = InfomationDetail.objects.filter(id=user.infomation_detail.id).first()
        info_detail_data = {
            "fullname" : request.POST.get("fullname"),
            "address" : request.POST.get("address"),
            "phone_number" : request.POST.get("phone_number"),
            "identity_card" : request.POST.get("identity_card"),
            "place_of_issue_of_identity_card" : request.POST.get("place_of_issue_of_identity_card"),
            "gender" : request.POST.get("gender"),
            "salary" : request.POST.get("salary"),
            "transaction_discount" : request.POST.get("transaction_discount"),
        }
        user_data= {}
        if request.POST.get("password"):
            user_data.update({
                "password" : make_password(request.POST.get("password")),
            })
        try:
            dob_datetime_object = datetime.strptime(request.POST.get("dob"), "%Y-%m-%d")
            date_of_issue_of_identity_card_datetime_object = datetime.strptime(request.POST.get("date_of_issue_of_identity_card"), "%Y-%m-%d")
            date_joined_datetime_object = datetime.strptime(request.POST.get("date_joined"), "%Y-%m-%d")
            
            info_detail_data["dob"] = dob_datetime_object
            info_detail_data["date_of_issue_of_identity_card"] = date_of_issue_of_identity_card_datetime_object
            info_detail_data["date_joined"] = date_joined_datetime_object
            info_detail.update(commit=True, **info_detail_data)
            user.update(commit=True, **user_data)
        except ValueError as e:
            print(e)
        
        return redirect("employees")


class EmployeeView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        stores = Store.objects.all()
        context = {
            "sidebar": "employees",
            "stores": stores,
            "roles": ROLE_CHOICES,
        }
        return render(request, "home/add_employee.html", context)
    
    def post(self, request, *args, **kwargs):

        valid_data = {
            "fullname" : request.POST.get("fullname"),
            "address" : request.POST.get("address"),
            "phone_number" : request.POST.get("phone_number"),
            "identity_card" : request.POST.get("identity_card"),
            "place_of_issue_of_identity_card" : request.POST.get("place_of_issue_of_identity_card"),
            "gender" : request.POST.get("gender"),
            "transaction_discount" : request.POST.get("transaction_discount"),
            "salary" : request.POST.get("salary"),
        }
        try:
            dob_datetime_object = datetime.strptime(request.POST.get("dob"), "%Y-%m-%d")
            date_of_issue_of_identity_card_datetime_object = datetime.strptime(request.POST.get("date_of_issue_of_identity_card"), "%Y-%m-%d")
            date_joined_datetime_object = datetime.strptime(request.POST.get("date_joined"), "%Y-%m-%d")

            store_id = request.POST.get("store")
            store_obj = Store.objects.filter(id=store_id).first()
            if store_obj:
                valid_data["store"] = store_obj
                valid_data["dob"] = dob_datetime_object
                valid_data["date_of_issue_of_identity_card"] = date_of_issue_of_identity_card_datetime_object
                valid_data["date_joined"] = date_joined_datetime_object
                info_detail = InfomationDetail.objects.create(**valid_data)
                User.objects.create(
                    username=request.POST.get("username"),
                    password=request.POST.get("password"),
                    role=request.POST.get("role"),
                    infomation_detail=info_detail
                )
        except ValueError as e:
            print(e)
        return redirect("employees")
    

class EmployeesView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        users = User.objects.filter(~Q(role="admin"))
        paginator = Paginator(users, 15)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {
            "users": page_obj,
            "sidebar": "employees",
        }
        return render(request, "home/employees.html", context)

class POSViewAPI(ListAPIView):

    queryset = POS.objects.all()
    serializer_class = POSSerializer


class POSDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = POS.objects.all()
    serializer_class = POSSerializer

    def put(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        obj = POS.objects.filter(id=id).first()
        serializer = POSSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class StoreViewAPI(ListAPIView):

    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class StoreDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def put(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        obj = Store.objects.filter(id=id).first()
        serializer = StoreSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class EmployeesViewAPI(ListAPIView):

    queryset = User.objects.filter(~Q(role="admin"))
    serializer_class = UserSerializer


class EmployeeDetailRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    queryset = User.objects.filter(~Q(role="admin"))
    serializer_class = UserSerializer

    def put(self, request, *args, **kwargs):
        id = kwargs.get("pk")
        obj = User.objects.filter(id=id).first()
        serializer = UserSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

class NoteBookDetailView(View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        notebook = NoteBook.objects.filter(id=pk).first()
        stores = Store.objects.all()
        if notebook:
            context = {
                "notebook": notebook,
                "stores": stores,
            }
            return render(request, "home/notebook.html", context)
        return redirect("notebooks")
    
    def post(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        notebook = NoteBook.objects.filter(id=pk).first()
        data = {
            "name": request.POST.get("name"),
        }
        store_id = request.POST.get("store")
        store_obj = Store.objects.filter(id=store_id).first()
        if store_obj:
            data["store"] = store_obj
            notebook.update(commit=True, **data)
        return redirect("notebooks")


class NotebooksView(View):

    def get(self, request, *args, **kwargs):
        notebooks = NoteBook.objects.all()
        paginator = Paginator(notebooks, 15)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {
            "notebooks": page_obj,
            "sidebar": "notebooks"
        }
        return render(request, "home/notebooks.html", context)


class NotebookView(View):

    def get(self, request, *args, **kwargs):
        stores = Store.objects.all()
        context = {
            "sidebar": "add_notebook",
            "stores": stores,
        }
        return render(request, "home/add_notebook.html", context)
    
    def post(self, request, *args, **kwargs):
        valid_data = {
            "name" : request.POST.get("name"),
        }
        store_id = request.POST.get("store")
        store_obj = Store.objects.filter(id=store_id).first()
        if store_obj:
            valid_data["store"] = store_obj
            NoteBook.objects.create(**valid_data)
        return redirect("notebooks")


class NotebookDetailDeleteView(View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        notebook = NoteBook.objects.filter(id=pk).first()
        if notebook:
            notebook.delete()
        return redirect("notebooks")


class POSDetailDeleteView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        pos = POS.objects.filter(id=pk).first()
        if pos:
            pos.delete()
        return redirect("poses")


class POSDetailView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        pos = POS.objects.filter(id=pk).first()
        stores = Store.objects.all()
        if pos:
            context = {
                "pos": pos,
                "stores": stores,
            }
            print(context)
            return render(request, "home/pos.html", context)
        return redirect("poses")
    
    def post(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        pos = POS.objects.filter(id=pk).first()
        data = {
            "pos_id" : request.POST.get("pos_id"),
            "mid" : request.POST.get("mid"),
            "tid" : request.POST.get("tid"),
            "note" : request.POST.get("note"),
            "money_limit_per_day" : request.POST.get("money_limit_per_day"),
            "status" : request.POST.get("status"),
            "bank_name" : request.POST.get("bank_name"),
        }
        store_id = request.POST.get("store")
        store_obj = Store.objects.filter(id=store_id).first()
        if store_obj:
            data["store"] = store_obj
            pos.update(commit=True, **data)
        return redirect("poses")


class POSesView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        poses = POS.objects.all()
        paginator = Paginator(poses, 15)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {
            "poses": page_obj,
            "sidebar": "poses",
        }
        return render(request, "home/poses.html", context)


class POSView(AdminRoleViewPermissionsMixin, View):

    def get(self, request, *args, **kwargs):
        stores = Store.objects.all()
        context = {
            "sidebar": "add_pos",
            "stores": stores,
        }
        return render(request, "home/add_pos.html", context)
    
    def post(self, request, *args, **kwargs):
        valid_data = {
            "pos_id" : request.POST.get("pos_id"),
            "mid" : request.POST.get("mid"),
            "tid" : request.POST.get("tid"),
            "note" : request.POST.get("note"),
            "money_limit_per_day" : request.POST.get("money_limit_per_day"),
            "status" : request.POST.get("status"),
            "bank_name" : request.POST.get("bank_name"),
        }
        store_id = request.POST.get("store")
        store_obj = Store.objects.filter(id=store_id).first()
        if store_obj:
            valid_data["store"] = store_obj
            POS.objects.create(**valid_data)
        return redirect("poses")


class Test(View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "swipecard",
        }
        return render(request, "home/test.html", context)

