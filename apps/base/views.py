from django.shortcuts import redirect


class AdminRoleViewPermissionsMixin(object):

    def has_permissions(self):
        if hasattr(self, "request"):
            if hasattr(self.request, "user"):
                if hasattr(self.request.user, "role"):
                    if self.request.user.role == 'admin':
                        return True
        return False 

    def dispatch(self, request, *args, **kwargs):
        if not self.has_permissions():
            return redirect("swipecard")
        return super().dispatch(request, *args, **kwargs)
