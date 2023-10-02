# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from rest_framework import serializers
from .models import BankAccount, CreditCard, Customer


class CreditCardCustomerRetrieveUpdateSerializer(serializers.Serializer):

    card_number = serializers.CharField()
    card_bank_name = serializers.CharField()


class BankAccountSerializer(serializers.Serializer):

    id = serializers.IntegerField(required=False)
    account_number = serializers.CharField(required=False)
    bank_name = serializers.CharField(required=False)


class CustomerRetrieveUpdateSerializer(serializers.ModelSerializer):

    bank_account = BankAccountSerializer(required=False)
    creditcard = CreditCardCustomerRetrieveUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = "__all__"

    def update(self, instance, validated_data):
        bank_account = validated_data.pop("bank_account", None)
        if bank_account:
            bank_account_obj = BankAccount.objects.filter(id=bank_account.pop("id", None)).first()
            if bank_account_obj:
                for attr, value in bank_account.items():
                    setattr(bank_account_obj, attr, value)
                bank_account_obj.save()
            instance.bank_account = bank_account_obj
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CustomerSerializer(serializers.ModelSerializer):

    phone_number = serializers.CharField()

    class Meta:
        model = Customer
        fields = "__all__"
        depth = 1

    def validate_phone_number(self, value):
        """
        Because this serializer only use for update data which is `phone_number` can not be modified.
        """
        return value


class CreditCardSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(max_length=127)
    customer = CustomerSerializer(required=False)

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
        if data.get("id_card_front_image"):
            data["id_card_front_image"] = self.context["request"].build_absolute_uri(data["id_card_front_image"])
        if data.get("id_card_back_image"):
            data["id_card_back_image"] = self.context["request"].build_absolute_uri(data["id_card_back_image"])
        if data.get("credit_card_back_image"):
            data["credit_card_back_image"] = self.context["request"].build_absolute_uri(data["credit_card_back_image"])
        if data.get("credit_card_front_image"):
            data["credit_card_front_image"] = self.context["request"].build_absolute_uri(
                data["credit_card_front_image"]
            )
        return data
