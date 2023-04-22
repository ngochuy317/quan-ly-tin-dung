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


class SwipeCardTransaction(models.Model):

    ...
