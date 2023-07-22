# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import resolve
from django.utils.deprecation import MiddlewareMixin


class LoginRequiredMiddleware(MiddlewareMixin):
    def process_request(self, request):
        assert hasattr(request, "user")
        if not request.user.is_authenticated:
            current_route_name = resolve(request.path_info).url_name
            if current_route_name not in settings.AUTH_EXEMPT_ROUTES:
                return HttpResponseRedirect(settings.LOGIN_URL)
