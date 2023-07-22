from django.contrib import admin

from .models import CreditCard, Customer, BankAccount


admin.site.register(CreditCard)
admin.site.register(Customer)
admin.site.register(BankAccount)
