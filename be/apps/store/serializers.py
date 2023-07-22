from rest_framework import serializers

from .models import BillPos


class BillPosSerializer(serializers.ModelSerializer):

    datetime_created = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")

    class Meta:
        model = BillPos
        fields = "__all__"
