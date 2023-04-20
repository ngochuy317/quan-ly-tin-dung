from django.urls import path

from .views import (
    HomeView,
    SwipeCardView,
    StoreView,
    StoreDetailView,
    StoreDetailDeleteView,
    StoresView,
    POSesView,
    POSView,
    EmployeeView,
    EmployeesView,
    EmployeeDetailView,
    EmployeeDetailDeleteView,
    Test,
)

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    path('swipecard/', SwipeCardView.as_view(), name="swipecard"),
    path('add_store/', StoreView.as_view(), name="add_store"),
    path('stores/', StoresView.as_view(), name="stores"),
    path('stores/<pk>/', StoreDetailView.as_view(), name="store-detail"),
    path('stores/<pk>/delete/', StoreDetailDeleteView.as_view(), name="delete-store"),
    path('add_pos/', POSView.as_view(), name="add_pos"),
    path('poses/', POSesView.as_view(), name="poses"),
    path('employees/', EmployeesView.as_view(), name="employees"),
    path('add_employee/', EmployeeView.as_view(), name="add_employee"),
    path('employees/<pk>/', EmployeeDetailView.as_view(), name="employee-detail"),
    path('employees/<pk>/delete/', EmployeeDetailDeleteView.as_view(), name="delete-employee"),
    path('test/', Test.as_view(), name="test"),
]