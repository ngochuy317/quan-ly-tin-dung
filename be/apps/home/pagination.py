from rest_framework import pagination
from rest_framework.response import Response


class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 2

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )
