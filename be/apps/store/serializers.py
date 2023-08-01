# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.base.constants import Y_M_D_H_M_FORMAT
from rest_framework import serializers
from .models import BillPos, FeePos4CreditCard, StoreMakePOS


class BillPosSerializer(serializers.ModelSerializer):

    datetime_created = serializers.DateTimeField(read_only=True, format=Y_M_D_H_M_FORMAT)

    class Meta:
        model = BillPos
        fields = "__all__"


class StoreMakePOSSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreMakePOS
        fields = "__all__"


class FeePos4CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeePos4CreditCard
        fields = "__all__"


class ShortFeePos4CreditCardSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    delete = serializers.BooleanField(required=False, write_only=True)
    exist = serializers.BooleanField(required=False, write_only=True)
    new = serializers.BooleanField(required=False, write_only=True)

    class Meta:
        model = FeePos4CreditCard
        fields = ("id", "fee", "type", "delete", "exist", "new")


class POSNickNameAPIViewSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    name = serializers.CharField()
    bank_name = serializers.CharField()
    bank_account = serializers.CharField()
