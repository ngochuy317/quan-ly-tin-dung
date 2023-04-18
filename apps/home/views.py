
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views import View

from apps.store.models import Store


class HomeView(View):

    def get(self, request, *args, **kwargs):
        return render(request, "home/index.html")


class SwipeCardView(View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "swipecard",
            "pagename": "Quẹt thẻ",
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


class StoreView(View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "add_store",
            "pagename": "Thiết lập cửa hàng"
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
            "pagename": "Cửa hàng"
        }
        return render(request, "home/stores.html", context)


class Test(View):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "swipecard",
            "form": POSForm,
        }
        return render(request, "home/test.html", context)

