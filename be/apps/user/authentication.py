# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals
from datetime import datetime

import jwt
from django.conf import settings
from rest_framework import authentication, exceptions, permissions
from .models import User


class CustomAuthentication(authentication.BaseAuthentication):
    AUTH_HEADER_TYPES = "Bearer"

    def authenticate(self, request):
        token_input = request.META.get("HTTP_AUTHORIZATION") or ""
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
                algorithms=["HS256"],
            )
            expire_time = token_payload.get("expire_time")
            expire_time = datetime.strptime(expire_time, settings.STRPTIME_FORMAT)
            if datetime.utcnow() >= expire_time:
                raise exceptions.AuthenticationFailed("Token expired")
            _id = token_payload.get("id")
            user = User.objects.filter(id=_id).first()
            if not user:
                raise exceptions.AuthenticationFailed("Invalid token")
            return (user, None)

        except (
            jwt.exceptions.DecodeError,
            jwt.exceptions.ExpiredSignatureError,
            jwt.exceptions.InvalidSignatureError,
        ) as e:
            raise exceptions.AuthenticationFailed(f"Invalid token with {e}")


class IsAdmin(permissions.BasePermission):
    """
    Permission class to check that only this user can get, update, delete his own resource
    """

    def has_permission(self, request, view):
        if hasattr(request, "user") and hasattr(request.user, "role"):
            return request.user.role == "admin"
        return False
