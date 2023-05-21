from django.contrib import admin
from django.contrib.auth.hashers import make_password

from .models import User, Permission, InfomationDetail


class UserAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        obj.password = make_password(form.cleaned_data["password"])
        super().save_model(request, obj, form, change)


admin.site.register(User, UserAdmin)
admin.site.register(Permission)
admin.site.register(InfomationDetail)
