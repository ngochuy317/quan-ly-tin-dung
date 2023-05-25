from django.db import models
from django.contrib.auth.hashers import make_password


class UserManager(models.Manager):

    def create(self, *args, **kwargs):
        password = kwargs.get("password")
        if password:
            kwargs["password"] = make_password(password)
        return super().create(*args, **kwargs) 