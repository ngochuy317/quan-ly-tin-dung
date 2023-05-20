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
    EmployeesListCreateAPIView,
    EmployeeDetailRetrieveUpdateDestroyAPIView,
    StoreListCreateAPIView,
    StoreListCreateAPIViewNoPagination,
    StoreDetailRetrieveUpdateDestroyAPIView,
    POSListCreateAPIView,
    POSDetailRetrieveUpdateDestroyAPIView,
    NotebookListCreateAPIView,
    NoteBookDetailRetrieveUpdateDestroyAPIView,
)

from apps.store.views import (
    TransactionHistory,
)

urlpatterns = [
    path('api/notebooks/', NotebookListCreateAPIView.as_view(), name="notebooks"),
    path('api/notebooks/<pk>/', NoteBookDetailRetrieveUpdateDestroyAPIView.as_view(), name="notebook-detail"),
    path('api/poses/', POSListCreateAPIView.as_view(), name="poses"),
    path('api/poses/<pk>/', POSDetailRetrieveUpdateDestroyAPIView.as_view(), name="pos-detail"),
    path('api/stores/', StoreListCreateAPIView.as_view(), name="stores"),
    path('api/stores/nopagination/', StoreListCreateAPIViewNoPagination.as_view(), name="stores"),
    path('api/stores/<pk>/', StoreDetailRetrieveUpdateDestroyAPIView.as_view(), name="stores-detail"),
    path('api/employees/', EmployeesListCreateAPIView.as_view(), name="employees"),
    path('api/employees/<pk>/', EmployeeDetailRetrieveUpdateDestroyAPIView.as_view(), name="employee-detail"),
]