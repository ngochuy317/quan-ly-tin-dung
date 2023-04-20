
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views import View
from django.db.models import Q

from apps.base.constants import ROLE_CHOICES
from apps.store.models import Store, POS
from apps.user.models import User, InfomationDetail


class HomeView(View):

    def get(self, request, *args, **kwargs):
        return render(request, "home/index.html")


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
        return render(request, "home/swipe_card.html", context)


class StoreDetailView(View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        store = Store.objects.filter(id=pk).first()
        if store:
            context = {
                "store": store,
            }
            return render(request, "home/store.html", context)
        return redirect("stores")
    
    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
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


class StoreDetailDeleteView(View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        store = Store.objects.filter(id=pk).first()
        if store:
            store.delete()
        return redirect("stores")


class EmployeeDetailDeleteView(View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        user = User.objects.filter(id=pk).first()
        if user:
            user.delete()
        return redirect("employees")


class StoreView(View):

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
    

class StoresView(View):

    def get(self, request, *args, **kwargs):
        stores = Store.objects.all()
        context = {
            "stores": stores,
            "sidebar": "stores",
        }
        return render(request, "home/stores.html", context)


class EmployeeDetailView(View):

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
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
        pk = kwargs.get('pk')
        user: User = User.objects.filter(id=pk).first()
        info_detail = InfomationDetail.objects.filter(id=user.infomation_detail.id).first()
        info_detail_data = {
            "fullname" : request.POST.get("fullname"),
            "address" : request.POST.get("address"),
            "phone_number" : request.POST.get("phone_number"),
            "identity_card" : request.POST.get("identity_card"),
            "place_of_issue_of_identity_card" : request.POST.get("place_of_issue_of_identity_card"),
            "date_of_issue_of_identity_card" : request.POST.get("date_of_issue_of_identity_card"),
            "gender" : request.POST.get("gender"),
            "dob" : request.POST.get("dob"),
            "date_joined" : request.POST.get("date_joined"),
            "salary" : request.POST.get("salary"),
            "transaction_discount" : request.POST.get("transaction_discount"),
        }
        info_detail.update(commit=True, **info_detail_data)
        return redirect("employees")


class EmployeeView(View):

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
            "date_of_issue_of_identity_card" : request.POST.get("date_of_issue_of_identity_card"),
            "gender" : request.POST.get("gender"),
            "dob" : request.POST.get("dob"),
            "date_joined" : request.POST.get("date_joined"),
            "transaction_discount" : request.POST.get("transaction_discount"),
            "salary" : request.POST.get("salary"),
        }
        store_id = request.POST.get("store")
        store_obj = Store.objects.filter(id=store_id).first()
        if store_obj:
            valid_data["store"] = store_obj
            info_detail = InfomationDetail.objects.create(**valid_data)
            User.objects.create(
                username=request.POST.get("username"),
                password=request.POST.get("password"),
                role=request.POST.get("role"),
                infomation_detail=info_detail
            )
        return redirect("employees")
    

class EmployeesView(View):

    def get(self, request, *args, **kwargs):
        users = User.objects.filter(~Q(role="admin"))
        context = {
            "users": users,
            "sidebar": "employees",
        }
        return render(request, "home/employees.html", context)


class POSView(View):
    def get(self, request, *args, **kwargs):
        stores = Store.objects.all()
        context = {
            "sidebar": "stores",
            "stores": stores,
        }
        return render(request, "home/add_pos.html", context)


class POSesView(View):

    def get(self, request, *args, **kwargs):
        poses = POS.objects.all()
        context = {
            "poses": poses,
            "sidebar": "poses",
        }
        return render(request, "home/poses.html", context)


class PosView(View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "add_store",
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
        POS.objects.create(**valid_data)
        return redirect("stores")


class Test(View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "swipecard",
        }
        return render(request, "home/test.html", context)

