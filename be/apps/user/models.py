from django.conf import settings
from django.db import models

from apps.base.constants import ROLE_CHOICES

from apps.store.models import Store

from .managers import UserManager

from datetime import datetime, timedelta
import jwt


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
    GENDER_CHOICES = (
        (1, "Nam"),
        (2, "Nữ"),
        (3, "Khác")
    )
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
    transaction_discount = models.FloatField()
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="users", blank=True, null=True)

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            self.save()


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

    class Meta:
        ordering = ['-id']

    def __str__(self) -> str:
        return self.username

    def update(self, commit=False, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if commit:
            print("commit", self.password)
            self.save()

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

    def get_access_token(self):
        data = {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'expire_time': (datetime.utcnow() + timedelta(hours=4)).strftime(settings.STRPTIME_FORMAT),
            'create_at': (datetime.utcnow()).strftime(settings.STRPTIME_FORMAT)
        }
        try:
            secret_key = settings.SECRET_KEY
            encoded_jwt = jwt.encode(
                data,
                secret_key,
                algorithm="HS256"
            )
            return encoded_jwt
        except jwt.exceptions.ExpiredSignatureError as e:
            print(e)
