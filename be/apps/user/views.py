# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from django.shortcuts import redirect, render
from django.views import View
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserLoginSerializer


class UserLoginView(APIView):
    authentication_classes = []

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(username=serializer.validated_data["username"]).first()
        if user:
            if check_password(serializer.validated_data["password"], user.password):
                data = {"access_token": user.get_access_token()}
                return Response(data, status=status.HTTP_200_OK)

        return Response(
            {
                "error_message": "Username or password is incorrect!",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class LogInView(View):
    def get(self, request, *args, **kwargs):
        return render(request, "home/login.html")

    def post(self, request, *args, **kwargs):
        username = request.POST.get("username")
        password = request.POST.get("password")
        context = {"errors": "Tên đăng nhập hoặc mật khẩu chưa chính xác"}
        if all([username, password]):
            user = User.objects.filter(username=username).first()
            if user and check_password(password, user.password):
                login(request, user, backend="apps.user.backends.MyCustomBackend")
                return redirect("home")
        return render(request, "home/login.html", context=context)


class LogOutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("login")
