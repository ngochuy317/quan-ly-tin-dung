# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.base.constants import Y_M_D_H_M_FORMAT
from rest_framework import serializers
from .models import BillPos


class BillPosSerializer(serializers.ModelSerializer):

    datetime_created = serializers.DateTimeField(read_only=True, format=Y_M_D_H_M_FORMAT)

    class Meta:
        model = BillPos
        fields = "__all__"
