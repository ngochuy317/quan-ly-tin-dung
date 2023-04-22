from django.contrib import admin

from .models import Store, POS, SwipeCardTransaction

admin.site.register(Store)
admin.site.register(POS)
admin.site.register(SwipeCardTransaction)
