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
    POSDetailView,
    POSDetailDeleteView,
    EmployeeView,
    EmployeesView,
    EmployeeDetailView,
    EmployeeDetailDeleteView,
    StoreCardView,
    StoreCardDetailView,
    NotebooksView,
    NotebookView,
    NoteBookDetailView,
    NotebookDetailDeleteView,
    Test,
)

from apps.store.views import (
    TransactionHistory,
)

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    path('swipecard/', SwipeCardView.as_view(), name="swipecard"),
    path('storecard/', StoreCardView.as_view(), name="storecard"),
    path('storecard/<pk>/', StoreCardDetailView.as_view(), name="storecard-detail"),
    path('add_store/', StoreView.as_view(), name="add_store"),
    path('stores/', StoresView.as_view(), name="stores"),
    path('stores/<pk>/', StoreDetailView.as_view(), name="store-detail"),
    path('stores/<pk>/delete/', StoreDetailDeleteView.as_view(), name="delete-store"),
    path('add_pos/', POSView.as_view(), name="add_pos"),
    path('poses/', POSesView.as_view(), name="poses"),
    path('add_pos/<pk>/', POSDetailView.as_view(), name="pos-detail"),
    path('add_pos/<pk>/delete/', POSDetailDeleteView.as_view(), name="delete-pos"),
    path('notebooks/', NotebooksView.as_view(), name="notebooks"),
    path('add_notebook/', NotebookView.as_view(), name="add_notebook"),
    path('add_notebook/<pk>/', NoteBookDetailView.as_view(), name="notebook-detail"),
    path('add_notebook/<pk>/delete/', NotebookDetailDeleteView.as_view(), name="delete-notebook"),
    path('employees/', EmployeesView.as_view(), name="employees"),
    path('add_employee/', EmployeeView.as_view(), name="add_employee"),
    path('employees/<pk>/', EmployeeDetailView.as_view(), name="employee-detail"),
    path('employees/<pk>/delete/', EmployeeDetailDeleteView.as_view(), name="delete-employee"),
    path('transaction-history/', TransactionHistory.as_view(), name="transaction-history"),
    path('test/', Test.as_view(), name="test"),
]