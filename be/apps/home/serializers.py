from rest_framework import serializers

from apps.user.models import User, InfomationDetail
from apps.store.models import (
    Store,
    POS,
    NoteBook,
    Customer,
    CreditCard,
    SwipeCardTransaction,
)


class InfomationDetailSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source='store.name')

    class Meta:
        model = InfomationDetail
        fields = fields = '__all__'
    
    def update(self, instance, validated_data):
        store = validated_data.pop('store')
        instance.store = store
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    infomation_detail = InfomationDetailSerializer()

    class Meta:
        model = User
        fields = fields = '__all__'

    def create(self, validated_data):
        infomation_detail_data = validated_data.pop('infomation_detail')
        infomation_detail_instance = InfomationDetail.objects.create(**infomation_detail_data)
        instance = User.objects.create(**validated_data, infomation_detail=infomation_detail_instance)
        return instance


class POSSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source='store.name')

    class Meta:
        model = POS
        fields = '__all__'
        read_only_fields = ('id', )

    def update(self, instance, validated_data):
        store = validated_data.pop('store')
        instance.store = store
        instance.save()
        return instance


class StoreSerializer(serializers.ModelSerializer):
    poses = POSSerializer(many=True)

    class Meta:
        model = Store
        fields = '__all__'
        read_only_fields = ('id', )


class NoteBookSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source='store.name')

    class Meta:
        model = NoteBook
        fields = '__all__'
        read_only_fields = ('id', )
    
    def update(self, instance, validated_data):
        store = validated_data.pop('store')
        instance.store = store
        instance.save()
        return instance


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ('name','phone_number', 'account_number', 'id_card_image')


class CreditCardSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context['request'].method in ['GET']:
                self.fields['credit_card_front_image'] = serializers.SerializerMethodField()
                self.fields['credit_card_back_image'] = serializers.SerializerMethodField()
        except KeyError:
            pass

    class Meta:
        model = CreditCard
        exclude = ("id",)

    def get_credit_card_front_image(self, obj):
        return self.context['request'].build_absolute_uri(obj.credit_card_front_image.url)

    def get_credit_card_back_image(self, obj):
        return self.context['request'].build_absolute_uri(obj.credit_card_back_image.url)


class SwipeCardTransactionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    creditcard = CreditCardSerializer()
    transaction_datetime = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context['request'].method in ['GET']:
                self.fields['creditcard'] = serializers.SerializerMethodField()
                self.fields['customer_id_card_front_image'] = serializers.SerializerMethodField()
                self.fields['customer_id_card_back_image'] = serializers.SerializerMethodField()
        except KeyError:
            pass


    class Meta:
        model = SwipeCardTransaction
        fields = ('__all__')

    def get_creditcard(self, obj):
        serializer_context = {'request': self.context.get('request')}
        serializer = CreditCardSerializer(obj.creditcard, context=serializer_context)
        return serializer.data

    def create(self, validated_data):
        creditcard_data = validated_data.pop('creditcard')
        creditcard_instance = CreditCard.objects.create(**creditcard_data)
        instance = SwipeCardTransaction.objects.create(**validated_data, creditcard=creditcard_instance)
        return instance
    
    def get_customer_id_card_front_image(self, obj):
        return self.context['request'].build_absolute_uri(obj.customer_id_card_front_image.url)

    def get_customer_id_card_back_image(self, obj):
        return self.context['request'].build_absolute_uri(obj.customer_id_card_back_image.url)
