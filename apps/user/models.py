from django.db import models

from apps.base.constants import ROLE_CHOICES

from apps.store.models import Store

from .managers import UserManager


class Permission(models.Model):

    name = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:
        return self.name


class Group(models.Model):

    name = models.CharField(max_length=255, unique=True)
    permissions = models.ManyToManyField(Permission)

    def __str__(self) -> str:
        return self.name
    

class InfomationDetail(models.Model):
    fullname = models.CharField(max_length=511)
    address = models.CharField(max_length=1023)
    phone_number = models.CharField(max_length=10)
    identity_card = models.CharField(max_length=20)
    place_of_issue_of_identity_card = models.CharField(max_length=511)
    date_of_issue_of_identity_card = models.DateField()
    gender = models.CharField(max_length=10)
    dob = models.DateField()
    date_joined = models.DateField()
    salary = models.IntegerField()
    transaction_discount = models.FloatField()
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="users", blank=True, null=True)

class User(models.Model):
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserManager()

    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=127, choices=ROLE_CHOICES)
    last_login = models.DateTimeField(blank=True, null=True)
    is_anonymous = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=True)
    permissions = models.ManyToManyField(Permission, blank=True, null=True)
    infomation_detail = models.OneToOneField(InfomationDetail, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.username
    
    def has_perm(self, perm):
        for _perm in self.permissions.all():
            if _perm.name == perm:
                return True
        return False
    
    @property
    def list_all_permissions(self):
        all_perms = {perm.name: False for perm in Permission.objects.all()}
        for _perm in self.permissions.all():
            all_perms[_perm.name] = True
        return all_perms
