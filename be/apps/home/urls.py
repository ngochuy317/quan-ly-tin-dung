from django.urls import path

from .views import (
    InformationDetailAPIView,
    EmployeesListCreateAPIView,
    EmployeeDetailRetrieveUpdateDestroyAPIView,
    StoreListCreateAPIView,
    StoreListCreateAPIViewNoPagination,
    StoreDetailRetrieveUpdateDestroyAPIView,
    POSListCreateAPIView,
    POSDetailRetrieveUpdateDestroyAPIView,
    NotebookListCreateAPIView,
    NoteBookDetailRetrieveUpdateDestroyAPIView,
    CustomerAPIView,
    CreditCardAPIView,
    SwipeCardTransactionAPIView,
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
    path('api/user/infomation-detail/', InformationDetailAPIView.as_view(), name="user-information-detail"),
    path('api/customer/', CustomerAPIView.as_view(), name="customer"),
    path('api/creditcard/upload/', CreditCardAPIView.as_view(), name="upload-creditcard"),
    path('api/swipecardtransaction/', SwipeCardTransactionAPIView.as_view(), name="swipe-card-transaction"),
]