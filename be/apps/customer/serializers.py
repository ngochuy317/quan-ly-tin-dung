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
