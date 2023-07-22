# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.contrib import admin
from .models import POS, BillPos, NoteBook, RowNotebook, Store, SwipeCardTransaction


class SwipeCardTransactionAdmin(admin.ModelAdmin):
    readonly_fields = (
        "transaction_datetime_created",
        "transaction_datetime_updated",
    )


admin.site.register(Store)
admin.site.register(BillPos)
admin.site.register(POS)
admin.site.register(SwipeCardTransaction, SwipeCardTransactionAdmin)
admin.site.register(NoteBook)
admin.site.register(RowNotebook)
