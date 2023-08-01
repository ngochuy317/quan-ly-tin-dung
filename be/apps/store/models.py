# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
import datetime

from django.db import models
from django.utils.timezone import now


class StoreMakePOS(models.Model):

    FOLDER_UPLOAD = "uploads/storemakepos/"

    WORKING_STATUS_CHOICES = ((1, "Đã đóng GPKD"), (2, "Chưa đóng GPKD"))

    name = models.CharField(max_length=127)
    note = models.TextField(blank=True)
    address = models.CharField(max_length=1023)
    tax_code_file = models.FileField(upload_to=FOLDER_UPLOAD, blank=True, null=True)
    representative_s_name = models.CharField(max_length=127, blank=True)
    representative_s_phone_number = models.CharField(max_length=127, blank=True)
    working_status = models.SmallIntegerField(choices=WORKING_STATUS_CHOICES, default=2)
    business_license_file = models.FileField(upload_to=FOLDER_UPLOAD, blank=True, null=True)
    representative_id_card_front_image = models.ImageField(upload_to=FOLDER_UPLOAD, blank=True, null=True)
    representative_id_card_back_image = models.ImageField(upload_to=FOLDER_UPLOAD, blank=True, null=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:
        return self.name

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()


class Store(models.Model):

    name = models.CharField(max_length=127)
    note = models.TextField(blank=True)
    address = models.CharField(max_length=1023)
    phone_number = models.CharField(max_length=20, default="")
    contract_of_house_renting_file = models.FileField(upload_to="uploads/store/", blank=True, null=True)
    rent = models.IntegerField(default=0)
    electric_bill = models.IntegerField(default=0)
    water_bill = models.IntegerField(default=0)
    surcharge = models.IntegerField(default=0)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:
        return self.name

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()


class StoreCost(models.Model):

    store_id = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="storecost")
    electricity_bill = models.BigIntegerField(default=0)
    water_bill = models.BigIntegerField(default=0)
    surcharge = models.BigIntegerField(default=0)
    rental_costs = models.BigIntegerField(default=0)
    date = models.DateField()


class POS(models.Model):

    STATUS_POS_CHOICES = ((1, "Đang hoạt động"), (2, "Tạm dừng"), (3, "Đóng"))
    RELATED_NAME = "poses"

    mid = models.CharField(max_length=127)
    tid = models.CharField(max_length=127)
    name = models.CharField(max_length=127)
    phone_number = models.CharField(max_length=24)
    note = models.TextField(blank=True)
    status = models.PositiveSmallIntegerField(choices=STATUS_POS_CHOICES, default=1)
    bank_name = models.CharField(max_length=127)
    bank_account = models.CharField(max_length=127)
    money_limit_per_day = models.PositiveBigIntegerField(default=0)
    money_limit_per_time = models.PositiveBigIntegerField(default=0)
    from_store = models.ForeignKey(
        StoreMakePOS, on_delete=models.CASCADE, related_name=RELATED_NAME, blank=True, null=True
    )
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name=RELATED_NAME)

    class Meta:
        ordering = ["-id"]

    def __str__(self) -> str:
        return f"{self.id} in {self.store}"

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()


class FeePos4CreditCard(models.Model):

    type = models.CharField(max_length=127)
    fee = models.FloatField()
    pos_machine = models.ForeignKey(POS, on_delete=models.CASCADE, related_name="fee4creditcard")

    class Meta:
        ordering = ["id"]


class NoteBook(models.Model):

    name = models.CharField(max_length=127, default="Cửa hàng")
    capacity_per_page = models.IntegerField(default=0)
    capacity = models.IntegerField(default=0)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="notebooks")

    class Meta:
        ordering = ["-id"]

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()

    def __str__(self) -> str:
        return self.name


class RowNotebook(models.Model):
    STATUS_CHOICES = ((1, "Đang lưu thẻ"), (2, "Đã trả thẻ"))
    notebook = models.ForeignKey(NoteBook, on_delete=models.CASCADE, related_name="row_notebook")
    card_given_date = models.DateField(default=datetime.date.today)
    card_taken_date = models.DateField(default=datetime.date.today)
    order_in_notebook = models.IntegerField(default=1)
    status = models.SmallIntegerField(choices=STATUS_CHOICES, default=1)
    storage_datetime = models.DateTimeField(default=now)
    closing_balance = models.BigIntegerField(blank=True, null=True)
    last_date = models.IntegerField(default=0)
    note = models.TextField(blank=True)
    card_location = models.CharField(max_length=256, default="")

    def __str__(self):
        return (
            f"Tên sổ: {self.notebook.name},  "
            f"  Trạng thái: {self.status},  "
            f"  Giờ lưu: {self.storage_datetime:%m/%d/%Y %H:%M}"
        )

    class Meta:
        ordering = ["-storage_datetime"]


class SwipeCardTransaction(models.Model):

    TRANSACTION_TYPE_CHOICES = ((1, "Rút tiền"), (2, "Đáo thẻ"))
    GENDER_CHOICES = ((1, "Nam"), (2, "Nữ"), (3, "Khác"))
    RELATED_NAME = "swipe_card_transaction"

    is_creditcard_stored = models.BooleanField(default=False)
    store_id = models.PositiveBigIntegerField()
    credit_card_number = models.CharField(max_length=20, db_index=True)
    store_name = models.CharField(max_length=127)
    store_address = models.CharField(max_length=1023)
    store_phone_number = models.CharField(max_length=20, default="")
    customer_money_needed = models.PositiveBigIntegerField(default=0)
    negative_money = models.PositiveBigIntegerField(default=0)
    fee = models.PositiveBigIntegerField(default=0)
    transaction_with_customer_image = models.ImageField(
        upload_to="uploads/swipecard_transaction/", blank=True, null=True
    )
    customer = models.ForeignKey(
        "customer.Customer", on_delete=models.CASCADE, related_name=RELATED_NAME, blank=True, null=True
    )
    user = models.ForeignKey("user.User", on_delete=models.CASCADE, related_name=RELATED_NAME)
    at_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name=RELATED_NAME, blank=True, null=True)
    transaction_datetime_created = models.DateTimeField(auto_now_add=True)
    transaction_datetime_updated = models.DateTimeField(auto_now=True)
    transaction_type = models.SmallIntegerField(choices=TRANSACTION_TYPE_CHOICES, default=1)

    class Meta:
        ordering = ["-id"]


class Product(models.Model):

    name = models.CharField(max_length=128)
    price = models.BigIntegerField(default=0)
    quantity = models.IntegerField(default=0)


class BillPos(models.Model):

    RELATED_NAME = "billposes"

    transaction = models.ForeignKey(SwipeCardTransaction, on_delete=models.CASCADE, related_name=RELATED_NAME)
    pos = models.ForeignKey(POS, on_delete=models.CASCADE, related_name=RELATED_NAME)
    bill_image = models.ImageField(upload_to="uploads/billpos/")
    total_money = models.PositiveBigIntegerField(blank=True, null=True)
    ref_no = models.CharField(max_length=128, blank=True)
    invoice_no = models.CharField(max_length=128, blank=True)
    batch = models.CharField(max_length=128, blank=True)
    authorization_code = models.CharField(max_length=128, blank=True)
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_updated = models.DateTimeField(auto_now=True)
    is_payment_received = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-datetime_created"]
