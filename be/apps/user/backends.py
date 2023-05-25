from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from .models import User


class MyCustomBackend(BaseBackend):

    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                return user
            else:
                return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None