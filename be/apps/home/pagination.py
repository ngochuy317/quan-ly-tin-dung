from rest_framework import pagination
from rest_framework.response import Response


class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 5

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )


class SwipeCardTransactionPageNumberPagination(CustomPageNumberPagination):

    def get_paginated_response(self, data):

        sum_customer_money_needed = sum([row.get("customer_money_needed", 0) or 0 for row in data])
        return Response(
            {
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "sum_customer_money_needed": sum_customer_money_needed,
                "results": data,
            }
        )
