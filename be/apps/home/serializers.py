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
    # store = serializers.IntegerField(required=True)

    class Meta:
        model = InfomationDetail
        fields = '__all__'

    def update(self, instance, validated_data):
        store = validated_data.pop('store')
        instance.store = store
        instance.save()
        return instance


class ShortInfomationDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = InfomationDetail
        fields = ('id', 'fullname',)


class UserSerializer(serializers.ModelSerializer):
    infomation_detail = InfomationDetailSerializer()
    password = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        infomation_detail_data = validated_data.pop('infomation_detail')
        infomation_detail_instance = InfomationDetail.objects.create(**infomation_detail_data)
        instance = User.objects.create(**validated_data, infomation_detail=infomation_detail_instance)
        return instance

    def update(self, instance, validated_data):
        infomation_detail = validated_data.pop('infomation_detail')
        if instance.infomation_detail:
            infomation_detail_instance = InfomationDetail.objects.filter(id=instance.infomation_detail.id).first()
            if infomation_detail_instance:
                for attr, value in infomation_detail.items():
                    setattr(infomation_detail_instance, attr, value)
                infomation_detail_instance.save()
            else:
                infomation_detail_instance = InfomationDetail.objects.create(**infomation_detail)
                instance.infomation_detail = infomation_detail_instance
        else:
            infomation_detail_instance = InfomationDetail.objects.create(**infomation_detail)
            instance.infomation_detail = infomation_detail_instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
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
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
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
        if obj.credit_card_front_image:
            return self.context['request'].build_absolute_uri(obj.credit_card_front_image.url)
        return ""

    def get_credit_card_back_image(self, obj):
        if obj.credit_card_back_image:
            return self.context['request'].build_absolute_uri(obj.credit_card_back_image.url)
        return ""


class GetRowNotebookSerializer(serializers.ModelSerializer):
    """
    For Get method
    """
    storage_datetime = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    creditcard = serializers.CharField(source='creditcards.card_number')

    class Meta:
        model = RowNotebook
        fields = "__all__"


class CreateRowNotebookSerializer(serializers.ModelSerializer):
    """
    For Post method
    """
    creditcard = CreditCardSerializer()
    transaction_id = serializers.IntegerField()
    is_creditcard_stored = serializers.BooleanField()

    class Meta:
        model = RowNotebook
        fields = "__all__"

    def create(self, validated_data):
        creditcard_data = validated_data.pop('creditcard')
        transaction_id = validated_data.pop('transaction_id')
        is_creditcard_stored = validated_data.pop('is_creditcard_stored')
        transaction_instance = SwipeCardTransaction.objects.filter(id=transaction_id).first()
        if transaction_instance:
            creditcard_instance = CreditCard.objects.filter(id=transaction_instance.creditcard.id).first()
            for attr, value in creditcard_data.items():
                setattr(creditcard_instance, attr, value)
            transaction_instance.is_creditcard_stored = is_creditcard_stored
            transaction_instance.save()
            instance = RowNotebook.objects.create(**validated_data)
            creditcard_instance.notebook = instance
            creditcard_instance.save()
            return instance
        raise serializers.ValidationError("Can not found creditcard object")


class ShortNoteBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteBook
        fields = '__all__'


class NoteBookSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source='store.name')
    row_notebook = GetRowNotebookSerializer(many=True, read_only=True)

    class Meta:
        model = NoteBook
        fields = '__all__'
        read_only_fields = ('id', )

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class StoreInformationDetailSerializer(serializers.ModelSerializer):
    # phone_number = serializers.CharField(allow_blank=True, required=False)
    poses = POSSerializer(many=True, read_only=True)
    notebooks = ShortNoteBookSerializer(many=True, read_only=True)
    # users = ShortInfomationDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Store
        fields = '__all__'
        # read_only_fields = ('id', )


class StoreSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(allow_blank=True, required=False)
    poses = POSSerializer(many=True, read_only=True)
    notebooks = NoteBookSerializer(many=True, read_only=True)
    users = ShortInfomationDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Store
        fields = '__all__'
        read_only_fields = ('id', )


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ('name', 'phone_number', 'account_number', 'id_card_image')


class SwipeCardTransactionReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.infomation_detail.fullname', read_only=True)
    pos = POSSerializer()

    class Meta:
        model = SwipeCardTransaction
        fields = (
            'id',
            'customer_money_needed',
            'transaction_datetime_created',
            'user_name',
            'fee',
            'customer_name',
            'customer_phone_number',
            'pos',
        )


class SwipeCardTransactionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    creditcard = CreditCardSerializer(required=False)
    transaction_datetime_created = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")
    transaction_datetime_updated = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M")
    username = serializers.CharField(source='user.username')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context['request'].method in ['GET']:
                self.fields['creditcard'] = serializers.SerializerMethodField()
                # self.fields['transaction_type'] = serializers.SerializerMethodField()
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

    # def get_transaction_type(self, obj):
    #     return obj.get_transaction_type_display()

    def create(self, validated_data):
        creditcard_data = validated_data.pop('creditcard')
        creditcard_instance = CreditCard.objects.create(**creditcard_data)
        instance = SwipeCardTransaction.objects.create(**validated_data, creditcard=creditcard_instance)
        return instance

    def update(self, instance: SwipeCardTransaction, validated_data):
        creditcard = validated_data.pop("creditcard", None)
        if creditcard:
            creditcard_instance = CreditCard.objects.filter(id=instance.creditcard.id).first()
            for attr, value in creditcard.items():
                setattr(creditcard_instance, attr, value)
            creditcard_instance.save()

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
