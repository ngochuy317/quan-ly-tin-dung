from rest_framework import serializers

from apps.user.models import User, InfomationDetail
from apps.store.models import (
    Store,
    StoreCost,
    POS,
    NoteBook,
    RowNotebook,
    Customer,
    CreditCard,
    Product,
    SwipeCardTransaction,
)


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'


class InfomationDetailSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source='store.name')

    class Meta:
        model = InfomationDetail
        fields = '__all__'

    def update(self, instance, validated_data):
        store = validated_data.pop('store')
        instance.store = store
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    infomation_detail = InfomationDetailSerializer()

    class Meta:
        model = User
        fields = '__all__'

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


class CreditCardSerializer(serializers.ModelSerializer):

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
        return self.context['request'].build_absolute_uri(obj.credit_card_front_image.url)

    def get_credit_card_back_image(self, obj):
        return self.context['request'].build_absolute_uri(obj.credit_card_back_image.url)


class RowNotebookSerializer(serializers.ModelSerializer):
    storage_datetime = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")
    creditcard = CreditCardSerializer(write_only=True)
    transaction_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = RowNotebook
        fields = "__all__"

    def create(self, validated_data):
        creditcard_data = validated_data.pop('creditcard')
        transaction_id = validated_data.pop('transaction_id')
        transaction_instance = SwipeCardTransaction.objects.filter(id=transaction_id).first()
        if transaction_instance:
            creditcard_instance = CreditCard.objects.create(**creditcard_data)
            transaction_instance.creditcard = creditcard_instance
            transaction_instance.save()
            instance = RowNotebook.objects.create(**validated_data)
            creditcard_instance.notebook = instance
            return instance
        raise serializers.ValidationError("Can not found creditcard object")


class NoteBookSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source='store.name')
    row_notebook = RowNotebookSerializer(many=True, read_only=True)

    class Meta:
        model = NoteBook
        fields = '__all__'
        read_only_fields = ('id', )

    def update(self, instance, validated_data):
        name = validated_data.get("name")
        store = validated_data.get('store')
        instance.name = name
        instance.store = store
        instance.save()
        return instance


class StoreSerializer(serializers.ModelSerializer):
    poses = POSSerializer(many=True)
    notebooks = NoteBookSerializer(many=True)

    class Meta:
        model = Store
        fields = '__all__'
        read_only_fields = ('id', )


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ('name', 'phone_number', 'account_number', 'id_card_image')


class SwipeCardTransactionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    creditcard = CreditCardSerializer(read_only=True)
    transaction_datetime = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context['request'].method in ['GET']:
                self.fields['creditcard'] = serializers.SerializerMethodField()
                self.fields['customer_id_card_front_image'] = serializers.SerializerMethodField()
                self.fields['customer_id_card_back_image'] = serializers.SerializerMethodField()
                self.fields['bill_pos_image'] = serializers.SerializerMethodField()
                self.fields['pos'] = serializers.SerializerMethodField()
        except KeyError:
            pass

    class Meta:
        model = SwipeCardTransaction
        fields = '__all__'

    def get_creditcard(self, obj):
        serializer_context = {'request': self.context.get('request')}
        serializer = CreditCardSerializer(obj.creditcard, context=serializer_context)
        return serializer.data

    def get_pos(self, obj):
        serializer = POSSerializer(obj.pos)
        return serializer.data

    def create(self, validated_data):
        # creditcard_data = validated_data.pop('creditcard')
        # creditcard_instance = CreditCard.objects.create(**creditcard_data)
        instance = SwipeCardTransaction.objects.create(**validated_data)  # , creditcard=creditcard_instance)
        return instance

    def update(self, instance, validated_data):
        # creditcard = validated_data.pop("creditcard", {})
        # if getattr(instance, "creditcard", ""):
        #     for attr, value in creditcard.items():
        #         setattr(instance.creditcard, attr, value)
        #     instance.creditcard.save()
        # else:
        #     creditcard_instance = CreditCard.objects.create(**creditcard)
        #     instance.creditcard = creditcard_instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def get_customer_id_card_front_image(self, obj):
        if obj.customer_id_card_front_image:
            return self.context['request'].build_absolute_uri(obj.customer_id_card_front_image.url)
        return ""

    def get_customer_id_card_back_image(self, obj):
        if obj.customer_id_card_back_image:
            return self.context['request'].build_absolute_uri(obj.customer_id_card_back_image.url)
        return ""

    def get_bill_pos_image(self, obj):
        if obj.bill_pos_image:
            return self.context['request'].build_absolute_uri(obj.bill_pos_image.url)
        return ""


class StoreCostSerializer(serializers.ModelSerializer):

    class Meta:
        model = StoreCost
        fields = '__all__'
