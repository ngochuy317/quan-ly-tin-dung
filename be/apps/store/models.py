from django.db import models
from django.utils.timezone import now


class Store(models.Model):

    code = models.CharField(max_length=127)
    name = models.CharField(max_length=127)
    note = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=1023)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        ordering = ['-id']

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

    STATUS_POS_CHOICES = (
        (1, "Đang hoạt động"),
        (2, "Tạm dừng"),
        (3, "Đóng")
    )

    pos_id = models.CharField(max_length=127)
    mid = models.CharField(max_length=127)
    tid = models.CharField(max_length=127)
    note = models.TextField(blank=True, null=True)
    status = models.PositiveSmallIntegerField(choices=STATUS_POS_CHOICES, default=1)
    bank_name = models.CharField(max_length=127)
    money_limit_per_day = models.PositiveBigIntegerField(default=0)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="poses")

    class Meta:
        ordering = ['-id']

    def __str__(self) -> str:
        return f"{self.pos_id} in {self.store}"

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()


class NoteBook(models.Model):

    name = models.CharField(max_length=127, default="Cửa hàng")
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="notebooks")

    class Meta:
        ordering = ['-id']

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()

    def __str__(self) -> str:
        return self.name


class RowNotebook(models.Model):
    notebook = models.ForeignKey(NoteBook, on_delete=models.CASCADE, related_name="row_notebook")
    status = models.CharField(max_length=128)
    storage_datetime = models.DateTimeField(default=now)
    closing_balance = models.BigIntegerField(blank=True, null=True)
    last_date = models.IntegerField(default=0)
    note = models.TextField(blank=True, null=True)
    card_location = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return f"Tên sổ: {self.notebook.name},  "\
                f"  Trạng thái: {self.status},  "\
                f"  Giờ lưu: {self.storage_datetime:%m/%d/%Y %H:%M}"

    class Meta:
        ordering = ['-storage_datetime']


class CreditCard(models.Model):

    card_number = models.CharField(max_length=127, blank=True, null=True)
    card_bank_name = models.CharField(max_length=127, blank=True, null=True)
    card_name = models.CharField(max_length=127, blank=True, null=True)
    card_issued_date = models.DateField(blank=True, null=True)
    card_expire_date = models.DateField(blank=True, null=True)
    card_ccv = models.CharField(max_length=127, blank=True, null=True)
    statement_date = models.DateField(blank=True, null=True)
    maturity_date = models.DateField(blank=True, null=True)
    credit_card_front_image = models.ImageField(upload_to='uploads/creditcards/', blank=True, null=True)
    credit_card_back_image = models.ImageField(upload_to='uploads/creditcards/', blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    notebook = models.OneToOneField(
        RowNotebook,
        on_delete=models.CASCADE,
        related_name="creditcards",
        null=True, blank=True
    )
    is_expired = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']


class Customer(models.Model):
    name = models.CharField(max_length=127, blank=True, null=True)
    phone_number = models.CharField(max_length=12, blank=True, null=True)
    gender = models.CharField(max_length=127, blank=True, null=True)
    account_number = models.CharField(max_length=127, blank=True, null=True)
    id_card_image = models.ImageField(upload_to='uploads/customer/')


class SwipeCardTransaction(models.Model):

    is_creditcard_stored = models.BooleanField(default=False)
    store_id = models.PositiveBigIntegerField()
    store_code = models.CharField(max_length=127)
    store_name = models.CharField(max_length=127)
    store_note = models.TextField(blank=True, null=True)
    store_address = models.CharField(max_length=1023)
    store_phone_number = models.CharField(max_length=20, blank=True, null=True)
    customer_name = models.CharField(max_length=127, blank=True, null=True)
    customer_phone_number = models.CharField(max_length=12, blank=True, null=True)
    customer_gender = models.CharField(max_length=127, blank=True, null=True)
    customer_account_number = models.CharField(max_length=127, blank=True, null=True)
    customer_id_card_front_image = models.ImageField(upload_to='uploads/customer/', blank=True, null=True)
    customer_id_card_back_image = models.ImageField(upload_to='uploads/customer/', blank=True, null=True)
    bill_pos_image = models.ImageField(upload_to='uploads/pos/')
    customer_money_needed = models.PositiveBigIntegerField(default=0)
    customer_account = models.CharField(max_length=127, blank=True, null=True)
    customer_bank_account = models.CharField(max_length=127, blank=True, null=True)
    line_of_credit = models.PositiveBigIntegerField(default=0)
    fee = models.PositiveBigIntegerField(default=0)
    creditcard = models.OneToOneField(
        CreditCard,
        on_delete=models.CASCADE,
        related_name="swipe_card_transaction",
        blank=True,
        null=True
    )
    is_payment_received = models.BooleanField(default=False)
    user = models.ForeignKey("user.User", on_delete=models.CASCADE, related_name="swipe_card_transaction")
    at_store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="swipe_card_transaction",
        blank=True,
        null=True
    )
    transaction_datetime_created = models.DateTimeField(auto_now_add=True)
    transaction_datetime_updated = models.DateTimeField(auto_now=True)
    pos = models.ForeignKey(POS, on_delete=models.CASCADE, related_name="swipe_card_transaction")

    class Meta:
        ordering = ['-id']


class Product(models.Model):

    name = models.CharField(max_length=128)
    price = models.BigIntegerField(default=0)
    quantity = models.IntegerField(default=0)


class BillPos(models.Model):

    transaction_id = models.PositiveBigIntegerField()
    bill_image = models.ImageField(upload_to='uploads/billpos/')
    total_money = models.PositiveBigIntegerField()
    batch = models.CharField(max_length=128, blank=True, null=True)
    invoice = models.CharField(max_length=128, blank=True, null=True)
    ref_no = models.CharField(max_length=128, blank=True, null=True)
    approve_code = models.CharField(max_length=128, blank=True, null=True)
    datetime_bill = models.DateTimeField()
    note = models.TextField()
