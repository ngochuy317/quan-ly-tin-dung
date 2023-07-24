# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from datetime import datetime, timedelta

import jwt
from apps.base.constants import ROLE_CHOICES
from apps.store.models import Store
from django.conf import settings
from django.db import models
from .managers import UserManager


class InfomationDetail(models.Model):
    GENDER_CHOICES = ((1, "Nam"), (2, "Nữ"), (3, "Khác"))
    fullname = models.CharField(max_length=511)
    address = models.CharField(max_length=1023)
    phone_number = models.CharField(max_length=10)
    identity_card = models.CharField(max_length=20)
    place_of_issue_of_identity_card = models.CharField(max_length=511)
    date_of_issue_of_identity_card = models.DateField()
    gender = models.PositiveSmallIntegerField(choices=GENDER_CHOICES, default=1)
    dob = models.DateField()
    date_joined = models.DateField()
    salary = models.IntegerField()
    transaction_discount = models.FloatField(default=0)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="users", blank=True, null=True)
    user_image = models.ImageField(upload_to="uploads/user/", blank=True, null=True)
    identity_card_front_image = models.ImageField(upload_to="uploads/user/", blank=True, null=True)
    identity_card_back_image = models.ImageField(upload_to="uploads/user/", blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()


class User(models.Model):
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    objects = UserManager()

    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=127, choices=ROLE_CHOICES)
    last_login = models.DateTimeField(blank=True, null=True)
    is_authenticated = models.BooleanField(default=True)
    infomation_detail = models.OneToOneField(InfomationDetail, on_delete=models.CASCADE)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:
        return self.username

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            print("commit", self.password)
            self.save()

    def get_access_token(self):
        data = {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "expire_time": (datetime.utcnow() + timedelta(hours=4)).strftime(settings.STRPTIME_FORMAT),
            "create_at": (datetime.utcnow()).strftime(settings.STRPTIME_FORMAT),
        }
        try:
            secret_key = settings.SECRET_KEY
            encoded_jwt = jwt.encode(data, secret_key, algorithm="HS256")
            return encoded_jwt
        except jwt.exceptions.ExpiredSignatureError as e:
            print(e)
