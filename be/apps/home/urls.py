from django.urls import path

from .views import (
    InformationDetailAPIView,
    EmployeesListCreateAPIView,
    EmployeeDetailRetrieveUpdateDestroyAPIView,
    StoreListCreateAPIView,
    StoreListAPIViewNoPagination,
    StoreCostCreateAPIView,
    StoreCostListAPIViewNoPagination,
    StoreDetailRetrieveUpdateDestroyAPIView,
    POSListCreateAPIView,
    POSDetailRetrieveUpdateDestroyAPIView,
    NotebookListCreateAPIView,
    NotebookListAPIViewNoPagination,
    NoteBookDetailRetrieveUpdateDestroyAPIView,
    # CreditCardAPIView,
    ProductListCreateAPIView,
    ProductRetrieveUpdateDestroyAPIView,
    SwipeCardTransactionAPIView,
    CreditCardManagementAPIView,
    AllTransaction4CreditCardAPIView,
    SwipeCardTransactionReportAPIView,
    SwipeCardTransactionDetailRetrieveUpdateDestroyAPIView,
    RowNotebookAPIView,
    RowNotebookListAPIView,
    TotalMoneyTodayAPIView,
)

urlpatterns = [
    path('api/notebooks/', NotebookListCreateAPIView.as_view(), name="notebooks"),
    path('api/notebooks/nopagination/', NotebookListAPIViewNoPagination.as_view(), name="notebooks-nopagination"),
    path('api/notebooks/<pk>/', NoteBookDetailRetrieveUpdateDestroyAPIView.as_view(), name="notebook-detail"),
    path('api/poses/', POSListCreateAPIView.as_view(), name="poses"),
    path('api/poses/<pk>/', POSDetailRetrieveUpdateDestroyAPIView.as_view(), name="pos-detail"),
    path('api/storecost/', StoreCostCreateAPIView.as_view(), name="store-cost"),
    path('api/storecost/nopagination/', StoreCostListAPIViewNoPagination.as_view(), name="store-cost"),
    path('api/stores/', StoreListCreateAPIView.as_view(), name="stores"),
    path('api/stores/nopagination/', StoreListAPIViewNoPagination.as_view(), name="stores"),
    path('api/stores/<pk>/', StoreDetailRetrieveUpdateDestroyAPIView.as_view(), name="stores-detail"),
    path('api/employees/', EmployeesListCreateAPIView.as_view(), name="employees"),
    path('api/employees/<pk>/', EmployeeDetailRetrieveUpdateDestroyAPIView.as_view(), name="employee-detail"),
    path('api/user/infomation-detail/', InformationDetailAPIView.as_view(), name="user-information-detail"),
    path('api/products/', ProductListCreateAPIView.as_view(), name="products"),
    path('api/products/<pk>/', ProductRetrieveUpdateDestroyAPIView.as_view(), name="product-detail"),
    # path('api/creditcard/upload/', CreditCardAPIView.as_view(), name="upload-creditcard"),
    path('api/rownotebook/<pk>/', RowNotebookListAPIView.as_view(), name="list-row-notebook"),
    path('api/savecardtonotebook/', RowNotebookAPIView.as_view(), name="save-card-to-notebook"),
    path('api/swipecardtransaction/', SwipeCardTransactionAPIView.as_view(), name="swipe-card-transaction"),
    path('api/creditcard/management/', CreditCardManagementAPIView.as_view(), name="swipe-card-transaction-creditcard"),
    path(
        'api/creditcard/management/<str:card_number>/',
        AllTransaction4CreditCardAPIView.as_view(),
        name="all-transaction-creditcard"
    ),
    path(
        'api/swipecardtransactionreport/',
        SwipeCardTransactionReportAPIView.as_view(),
        name="swipe-card-transaction-report"
    ),
    path('api/totalmoneytoday/', TotalMoneyTodayAPIView.as_view(), name="total-money-today"),
    path(
        'api/swipecardtransaction/<pk>/',
        SwipeCardTransactionDetailRetrieveUpdateDestroyAPIView.as_view(),
        name="swipe-card-transaction-detail"
    ),
]
