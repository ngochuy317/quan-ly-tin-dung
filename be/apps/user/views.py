from django.contrib.auth.hashers import check_password
from django.contrib.auth import login, logout
from django.shortcuts import render, redirect
from django.views import View

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User
from .serializers import UserLoginSerializer


class UserLoginView(APIView):

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(username=serializer.validated_data['username']).first()
        if user:
            if check_password(serializer.validated_data['password'], user.password):
                data = {
                    'access_token': user.get_access_token()
                }
                return Response(data, status=status.HTTP_200_OK)

        return Response({
            'error_message': 'Username or password is incorrect!',
        }, status=status.HTTP_400_BAD_REQUEST)


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
                login(request, user, backend='apps.user.backends.MyCustomBackend')
                return redirect("home")
        return render(request, "home/login.html", context=context)


class LogOutView(View):

    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("login")
