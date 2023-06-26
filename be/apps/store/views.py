from django.core.paginator import Paginator
from django.shortcuts import render
from django.views import View

from .models import SwipeCardTransaction


class TransactionHistory(View):

    def get(self, request, *args, **kwargs):
        if request.user.role != "admin":
            transactions = SwipeCardTransaction.objects.\
                filter(user__id=request.user.id).\
                order_by("-transaction_datetime_created")
        else:
            transactions = SwipeCardTransaction.objects.all()
        paginator = Paginator(transactions, 15)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {
            "transactions": page_obj,
            "sidebar": "transaction-history",
        }
        return render(request, "home/transaction_history.html", context)
