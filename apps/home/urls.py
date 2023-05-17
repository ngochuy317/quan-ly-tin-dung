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
    StoreCardStorageView,
    StoreCardStorageDetailView,
    StoreCardNotebookDetailView,
    NotebooksView,
    NotebookView,
    NoteBookDetailView,
    NotebookDetailDeleteView,
    Test,
    EmployeesViewAPI,
    EmployeeDetailRetrieveUpdateDestroyAPIView,
    StoreViewAPI,
    StoreDetailRetrieveUpdateDestroyAPIView,
    POSViewAPI,
    POSDetailRetrieveUpdateDestroyAPIView,
)

from apps.store.views import (
    TransactionHistory,
)

urlpatterns = [
    path('api/poses/', POSViewAPI.as_view(), name="poses"),
    path('api/poses/<pk>/', POSDetailRetrieveUpdateDestroyAPIView.as_view(), name="pos-detail"),
    path('api/stores/', StoreViewAPI.as_view(), name="stores"),
    path('api/stores/<pk>/', StoreDetailRetrieveUpdateDestroyAPIView.as_view(), name="stores-detail"),
    path('api/employees/', EmployeesViewAPI.as_view(), name="employees"),
    path('api/employees/<pk>/', EmployeeDetailRetrieveUpdateDestroyAPIView.as_view(), name="employee-detail"),
]