from rest_framework import pagination, status
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


class CustomPageNumberPaginationPageSize15(CustomPageNumberPagination):
    page_size = 15


class SwipeCardTransactionPageNumberPagination(CustomPageNumberPagination):

    def get_paginated_response(self, data):

        try:
            pos_id = self.request.GET.get("pos")
            sum_customer_money_needed = 0
            money_limit_per_day = 0
            # for row in data:
            #     sum_customer_money_needed += row.get("customer_money_needed", 0) or 0
            #     if pos_id:
            #         money_limit_per_day = row.get("pos", {}).get("money_limit_per_day")
            #     else:
            #         money_limit_per_day += row.get("pos", {}).get("money_limit_per_day")
            # sum_customer_money_needed = sum([row.get("customer_money_needed", 0) or 0 for row in data])

            return Response(
                {
                    "count": self.page.paginator.count,
                    "total_pages": self.page.paginator.num_pages,
                    # "sum_customer_money_needed": sum_customer_money_needed,
                    # "money_limit_per_day": money_limit_per_day,
                    "results": data,
                }
            )
        except Exception as e:
            context = {
                "error_message": e,
            }
            return Response(context, status=status.HTTP_400_BAD_REQUEST)
