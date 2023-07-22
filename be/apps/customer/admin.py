# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.contrib import admin
from .models import BankAccount, CreditCard, Customer


admin.site.register(CreditCard)
admin.site.register(Customer)
admin.site.register(BankAccount)
