from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.generics import ListAPIView

from .filters import CreditCardFilter
from .models import CreditCard
from .serializers import CreditCardSerializer


class CreditCardAPIView(ListAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    filterset_class = CreditCardFilter
    serializer_class = CreditCardSerializer
    queryset = CreditCard.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = CreditCardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response(response.data[:5], status=response.status_code)
