from django.db import models
from django.utils.timezone import now


class Store(models.Model):

    code = models.CharField(max_length=127)
    name = models.CharField(max_length=127)
    note = models.TextField(blank=True, null=True)
    address =  models.CharField(max_length=1023)
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


class POS(models.Model):

    pos_id = models.CharField(max_length=127)
    mid = models.CharField(max_length=127)
    tid = models.CharField(max_length=127)
    note = models.TextField()
    status = models.CharField(max_length=30)
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


class CreditCard(models.Model):
    
    card_number = models.CharField(max_length=127, blank=True, null=True)
    card_bank_name = models.CharField(max_length=127, blank=True, null=True)
    card_name = models.CharField(max_length=127, blank=True, null=True)
    card_issued_date = models.DateField(blank=True, null=True)
    card_expire_date = models.DateField(blank=True, null=True)
    card_ccv = models.CharField(max_length=127, blank=True, null=True)
    statement_date = models.DateField(blank=True, null=True)
    maturity_date = models.DateField(blank=True, null=True)
    credit_card_front_image = models.ImageField(upload_to ='uploads/creditcards/')
    credit_card_back_image = models.ImageField(upload_to ='uploads/creditcards/')
    notebook = models.ForeignKey(NoteBook, on_delete=models.CASCADE, related_name="creditcards", null=True, blank=True)

    class Meta:
        ordering = ['-id']


class Customer(models.Model):
    name = models.CharField(max_length=127, blank=True, null=True)
    phone_number = models.CharField(max_length=12, blank=True, null=True)
    gender = models.CharField(max_length=127, blank=True, null=True)
    account_number = models.CharField(max_length=127, blank=True, null=True)
    id_card_image = models.ImageField(upload_to ='uploads/customer/')


class SwipeCardTransaction(models.Model):

    store_code = models.CharField(max_length=127)
    store_name = models.CharField(max_length=127)
    store_note = models.TextField(blank=True, null=True)
    store_address =  models.CharField(max_length=1023)
    store_phone_number = models.CharField(max_length=20, blank=True, null=True)
    customer_name = models.CharField(max_length=127, blank=True, null=True)
    customer_phone_number = models.CharField(max_length=12, blank=True, null=True)
    customer_gender = models.CharField(max_length=127, blank=True, null=True)
    customer_account_number = models.CharField(max_length=127, blank=True, null=True)
    customer_id_card_front_image = models.ImageField(upload_to ='uploads/customer/')
    customer_id_card_back_image = models.ImageField(upload_to ='uploads/customer/')
    customer_money_needed = models.PositiveBigIntegerField(default=0)
    customer_account = models.CharField(max_length=127, blank=True, null=True)
    customer_bank_account = models.CharField(max_length=127, blank=True, null=True)
    line_of_credit = models.PositiveBigIntegerField(default=0)
    fee = models.PositiveBigIntegerField(default=0)
    creditcard = models.OneToOneField(CreditCard, on_delete=models.CASCADE, related_name="swipe_card_transaction",blank=True, null=True)
    is_payment_received = models.BooleanField(default=False)
    user = models.ForeignKey("user.User", on_delete=models.CASCADE, related_name="swipe_card_transaction")
    at_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="swipe_card_transaction", blank=True, null=True)
    transaction_datetime = models.DateTimeField(default=now)

    class Meta:
        ordering = ['-id']
