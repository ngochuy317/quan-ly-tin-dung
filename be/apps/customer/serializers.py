from rest_framework import serializers

from .models import CreditCard, Customer


class CreditCardSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(max_length=127)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context['request'].method in ['GET']:
                self.fields['credit_card_front_image'] = serializers.SerializerMethodField()
                self.fields['credit_card_back_image'] = serializers.SerializerMethodField()
            if self.context['request'].method in ['PUT']:
                self.fields['credit_card_front_image'] = serializers.CharField()
                self.fields['credit_card_back_image'] = serializers.CharField()
        except KeyError:
            pass

    class Meta:
        model = CreditCard
        fields = "__all__"

    def get_credit_card_front_image(self, obj):
        if obj.credit_card_front_image:
            return self.context['request'].build_absolute_uri(obj.credit_card_front_image.url)
        return ""

    def get_credit_card_back_image(self, obj):
        if obj.credit_card_back_image:
            return self.context['request'].build_absolute_uri(obj.credit_card_back_image.url)
        return ""


class CreditCardCustomSerializer(CreditCardSerializer):
    

    def to_representation(self, instance):
        data = super().to_representation(instance)
        customer = Customer.objects.filter(credit_card__id=data["id"]).first()
        data["customer"] = {}
        data["customer"]["name"] =  customer.name
        data["customer"]["gender"] =  customer.gender
        data["customer"]["phone_number"] =  customer.phone_number
        if customer.bank_account:
            data["customer"]["bank_account"] =  {}
            data["customer"]["bank_account"]["account_number"] =  customer.bank_account.account_number
            data["customer"]["bank_account"]["bank_name"] =  customer.bank_account.bank_name
        if customer.id_card_front_image:
            data["customer"]["id_card_front_image"] = self.context['request'].build_absolute_uri(customer.id_card_front_image.url)
        if customer.id_card_back_image:
            data["customer"]["id_card_back_image"] = self.context['request'].build_absolute_uri(customer.id_card_back_image.url)
        if data.get("credit_card_back_image"):
            data["credit_card_back_image"] = self.context['request'].build_absolute_uri(data["credit_card_back_image"])
        if data.get("credit_card_front_image"):
            data["credit_card_front_image"] = self.context['request'].build_absolute_uri(data["credit_card_front_image"])
        return data