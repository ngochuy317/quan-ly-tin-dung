from django.contrib import admin

from .models import CreditCard, Customer


admin.site.register(CreditCard)
admin.site.register(Customer)
