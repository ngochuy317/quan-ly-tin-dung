# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.contrib.auth.hashers import make_password
from django.db import models


class UserManager(models.Manager):
    def create(self, *args, **kwargs):
        password = kwargs.get("password")
        if password:
            kwargs["password"] = make_password(password)
        return super().create(*args, **kwargs)
