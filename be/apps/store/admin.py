from django.contrib import admin

from .models import (
    Store, 
    POS,
    SwipeCardTransaction, 
    CreditCard, 
    NoteBook
)

class SwipeCardTransactionAdmin(admin.ModelAdmin):
    readonly_fields=('transaction_datetime',)

admin.site.register(Store)
admin.site.register(POS)
admin.site.register(SwipeCardTransaction, SwipeCardTransactionAdmin)
admin.site.register(CreditCard)
admin.site.register(NoteBook)
