from django.utils.deprecation import MiddlewareMixin
from django.urls import resolve
from django.http import HttpResponseRedirect
from django.conf import settings


class LoginRequiredMiddleware(MiddlewareMixin):

    def process_request(self, request):
        assert hasattr(request, 'user')
        if not request.user.is_authenticated:
            current_route_name = resolve(request.path_info).url_name
            if not current_route_name in settings.AUTH_EXEMPT_ROUTES:
                return HttpResponseRedirect(settings.LOGIN_URL)
