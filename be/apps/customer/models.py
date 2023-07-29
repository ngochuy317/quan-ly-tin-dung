# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.db import models


class BankAccount(models.Model):

    account_number = models.CharField(max_length=127)
    bank_name = models.CharField(max_length=127)

    def __str__(self) -> str:
        return f"{self.bank_name} -- {self.account_number[-4:]}"


class CreditCard(models.Model):

    FOLDER_UPLOAD = "uploads/creditcards/"

    card_number = models.CharField(max_length=20, unique=True)
    card_bank_name = models.CharField(max_length=127, blank=True)
    card_name = models.CharField(max_length=127, blank=True)
    card_issued_date = models.DateField(blank=True, null=True)
    card_expire_date = models.DateField(blank=True, null=True)
    card_ccv = models.CharField(max_length=3, blank=True)
    statement_date = models.DateField(blank=True, null=True)
    maturity_date = models.DateField(blank=True, null=True)
    credit_card_front_image = models.ImageField(upload_to=FOLDER_UPLOAD, blank=True, null=True)
    credit_card_back_image = models.ImageField(upload_to=FOLDER_UPLOAD, blank=True, null=True)
    note = models.TextField(blank=True, default="")
    notebook = models.OneToOneField(
        "store.RowNotebook", on_delete=models.CASCADE, related_name="creditcards", null=True, blank=True
    )
    line_of_credit = models.PositiveBigIntegerField(default=0)

    def __str__(self) -> str:
        return self.card_number


class Customer(models.Model):

    GENDER_CHOICES = ((1, "Nam"), (2, "Nữ"), (3, "Khác"))
    FOLDER_UPLOAD = "uploads/customer/"
    RELATED_NAME = "customer"

    name = models.CharField(max_length=127, blank=True)
    phone_number = models.CharField(max_length=12, unique=True)
    gender = models.PositiveSmallIntegerField(choices=GENDER_CHOICES, default=3)
    bank_account = models.ForeignKey(
        BankAccount, on_delete=models.CASCADE, related_name=RELATED_NAME, null=True, blank=True
    )
    id_card_front_image = models.ImageField(upload_to=FOLDER_UPLOAD, blank=True, null=True)
    id_card_back_image = models.ImageField(upload_to=FOLDER_UPLOAD, blank=True, null=True)
    credit_card = models.ForeignKey(
        CreditCard,
        on_delete=models.CASCADE,
        related_name=RELATED_NAME,
    )

    def __str__(self) -> str:
        return f"Name: {self.name} Phone number: {self.phone_number}"
