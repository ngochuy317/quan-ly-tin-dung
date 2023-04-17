from django.contrib.auth.hashers import check_password
from django.contrib.auth import login, logout
from django.shortcuts import render, redirect
from django.views import View

from .models import User

class LogInView(View):

    def get(self, request, *args, **kwargs):
        return render(request, "home/login.html")
    
    def post(self, request, *args, **kwargs):
        username = request.POST.get("username")
        password = request.POST.get("password")
        context = {
            "errors": "Tên đăng nhập hoặc mật khẩu chưa chính xác"
        }
        if all([username, password]):
            user = User.objects.filter(username=username).first()
            if user and check_password(password, user.password):
                login(request, user)
                return redirect("index")
        return render(request, "home/login.html", context=context)


class LogOutView(View):

    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("login")
