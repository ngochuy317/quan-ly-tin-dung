from django.db import models


class Store(models.Model):

    code = models.CharField(max_length=127)
    name = models.CharField(max_length=127)
    note = models.TextField()
    address =  models.CharField(max_length=1023)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

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

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()


class CreditCard(models.Model):

    card_number = models.CharField(max_length=127)
    card_bank_name = models.CharField(max_length=127)
    card_name = models.CharField(max_length=127)
    card_issued_date = models.DateField()
    card_expire_date = models.DateField()
    card_ccv = models.CharField(max_length=127)
    statement_date = models.DateField()
    maturity_date = models.DateField()
    notebook = models.OneToOneField(NoteBook, on_delete=models.CASCADE, related_name="creditcard", null=True, blank=True)


class SwipeCardTransaction(models.Model):

    customer_code = models.CharField(max_length=127)
    customer_name = models.CharField(max_length=127)
    customer_gender = models.CharField(max_length=127)
    phone_number = models.CharField(max_length=127)
    customer_money_needed = models.PositiveBigIntegerField(default=0)
    customer_account = models.CharField(max_length=127)
    customer_bank_account = models.CharField(max_length=127)
    line_of_credit = models.PositiveBigIntegerField(default=0)
    fee = models.PositiveBigIntegerField(default=0)
    creditcard = models.OneToOneField(CreditCard, on_delete=models.CASCADE, related_name="swipe_card_transaction")
    is_payment_received = models.BooleanField(default=False)
    user = models.OneToOneField("user.User", on_delete=models.CASCADE, related_name="swipe_card_transaction")
