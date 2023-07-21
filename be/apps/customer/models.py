from django.db import models


class BankAccount(models.Model):

    account_number = models.CharField(max_length=127)
    bank_name = models.CharField(max_length=127)


class CreditCard(models.Model):

    card_number = models.CharField(max_length=127, unique=True)
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
        "store.RowNotebook",
        on_delete=models.CASCADE,
        related_name="creditcards",
        null=True, blank=True
    )
    line_of_credit = models.PositiveBigIntegerField(default=0)

    def __str__(self) -> str:
        return self.card_number


class Customer(models.Model):
    GENDER_CHOICES = (
        (1, "Nam"),
        (2, "Nữ"),
        (3, "Khác")
    )

    name = models.CharField(max_length=127, blank=True, null=True)
    phone_number = models.CharField(max_length=12, unique=True)
    gender = models.PositiveSmallIntegerField(choices=GENDER_CHOICES, default=3)
    bank_account = models.ForeignKey(
        BankAccount,
        on_delete=models.CASCADE,
        related_name="customer",
        null=True, blank=True
    )
    id_card_front_image = models.ImageField(upload_to='uploads/customer/', blank=True, null=True)
    id_card_back_image = models.ImageField(upload_to='uploads/customer/', blank=True, null=True)
    credit_card = models.ForeignKey(
        CreditCard,
        on_delete=models.CASCADE,
        related_name="customer",
    )

    def __str__(self) -> str:
        return f"Name: {self.name} Phone number: {self.phone_number}"
