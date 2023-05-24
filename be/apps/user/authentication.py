from django.conf import settings

from rest_framework import authentication, permissions, exceptions

import jwt
from datetime import datetime

from .models import User


class CustomAuthentication(authentication.BaseAuthentication):
    AUTH_HEADER_TYPES = 'Bearer'

    def authenticate(self, request):
        token_input = request.META.get('HTTP_AUTHORIZATION') or ""
        if not token_input.split():
            return None
        auth_header_type_is_valid = bool(str(token_input.split()[0]) == self.AUTH_HEADER_TYPES)
        if not auth_header_type_is_valid:
            return None
        token = token_input.split()[-1]
        if not token:
            return None

        try:
            token_payload = jwt.decode(
                jwt=token,
                key=settings.SECRET_KEY,
                algorithms=['HS256'],
            )
            expire_time = token_payload.get("expire_time")
            expire_time = datetime.strptime(expire_time, settings.STRPTIME_FORMAT)
            # if not expire_time or datetime.utcnow() >= expire_time:
            #     raise exceptions.AuthenticationFailed('Token expired')
            id = token_payload.get("id")
            user = User.objects.filter(id=id).first()
            if not user:
                raise exceptions.AuthenticationFailed('Invalid token')
            return (user, None)

        except (
            jwt.exceptions.DecodeError,
            jwt.exceptions.ExpiredSignatureError,
            jwt.exceptions.InvalidSignatureError,
        ) as e:
            raise exceptions.AuthenticationFailed(f'Invalid token with {e}')
        

class IsAdmin(permissions.BasePermission):
    """
    Permission class to check that only this user can get, update, delete his own resource
    """

    def has_permission(self, request, view):
        return request.user.role == "admin"
