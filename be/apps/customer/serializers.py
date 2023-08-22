# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from rest_framework import serializers
from .models import CreditCard, Customer


class CreditCardCustomerRetrieveUpdateSerializer(serializers.Serializer):

    card_number = serializers.CharField()
    card_bank_name = serializers.CharField()


class CustomerRetrieveUpdateSerializer(serializers.ModelSerializer):

    creditcard = CreditCardCustomerRetrieveUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = "__all__"
        depth = 1


class CustomerSerializer(serializers.ModelSerializer):

    phone_number = serializers.CharField()

    class Meta:
        model = Customer
        fields = "__all__"

    def validate_phone_number(self, value):
        """
        Because this serializer only use for update data which is `phone_number` can not be modified.
        """
        return value


class CreditCardSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(max_length=127)
    customer = CustomerSerializer(read_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context["request"].method in ["GET"]:
                self.fields["credit_card_front_image"] = serializers.SerializerMethodField()
                self.fields["credit_card_back_image"] = serializers.SerializerMethodField()
            if self.context["request"].method in ["PUT"]:
                self.fields["credit_card_front_image"] = serializers.CharField()
                self.fields["credit_card_back_image"] = serializers.CharField()
        except KeyError:
            pass

    class Meta:
        model = CreditCard
        fields = "__all__"

    def get_credit_card_front_image(self, obj):
        if obj.credit_card_front_image:
            return self.context["request"].build_absolute_uri(obj.credit_card_front_image.url)
        return ""

    def get_credit_card_back_image(self, obj):
        if obj.credit_card_back_image:
            return self.context["request"].build_absolute_uri(obj.credit_card_back_image.url)
        return ""


class CreditCardRetriveUpdateDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCard
        exclude = ("notebook",)


class CreditCardCustomSerializer(CreditCardSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        creditcard = CreditCard.objects.filter(id=data["id"]).first()
        customer = creditcard.customer
        data["customer"] = {}
        data["customer"]["name"] = customer.name
        data["customer"]["gender"] = customer.gender
        data["customer"]["phone_number"] = customer.phone_number
        if customer.bank_account:
            data["customer"]["bank_account"] = {}
            data["customer"]["bank_account"]["account_number"] = customer.bank_account.account_number
            data["customer"]["bank_account"]["bank_name"] = customer.bank_account.bank_name
        if customer.id_card_front_image:
            data["customer"]["id_card_front_image"] = self.context["request"].build_absolute_uri(
                customer.id_card_front_image.url
            )
        if customer.id_card_back_image:
            data["customer"]["id_card_back_image"] = self.context["request"].build_absolute_uri(
                customer.id_card_back_image.url
            )
        if data.get("credit_card_back_image"):
            data["credit_card_back_image"] = self.context["request"].build_absolute_uri(data["credit_card_back_image"])
        if data.get("credit_card_front_image"):
            data["credit_card_front_image"] = self.context["request"].build_absolute_uri(
                data["credit_card_front_image"]
            )
        return data
