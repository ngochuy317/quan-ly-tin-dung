# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.base.constants import Y_M_D_H_M_FORMAT
from apps.customer.models import BankAccount, CreditCard, Customer
from apps.customer.serializers import CreditCardSerializer
from apps.store.models import POS, BillPos, NoteBook, Product, RowNotebook, Store, StoreCost, SwipeCardTransaction
from apps.user.models import InfomationDetail, User
from rest_framework import serializers


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class InfomationDetailSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source="store.name")

    class Meta:
        model = InfomationDetail
        fields = "__all__"

    def update(self, instance, validated_data):
        store = validated_data.pop("store")
        instance.store = store
        instance.save()
        return instance


class ShortInfomationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfomationDetail
        fields = (
            "id",
            "fullname",
        )


class UserSerializer(serializers.ModelSerializer):
    infomation_detail = InfomationDetailSerializer()
    password = serializers.CharField(allow_blank=True, required=False, write_only=True)

    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        infomation_detail_data = validated_data.pop("infomation_detail")
        infomation_detail_instance = InfomationDetail.objects.create(**infomation_detail_data)
        instance = User.objects.create(**validated_data, infomation_detail=infomation_detail_instance)
        return instance

    def update(self, instance, validated_data):
        infomation_detail = validated_data.pop("infomation_detail")
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
    store_name = serializers.ReadOnlyField(source="store.name")

    class Meta:
        model = POS
        fields = "__all__"
        read_only_fields = ("id",)

    def update(self, instance, validated_data):
        store = validated_data.pop("store")
        instance.store = store
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class GetRowNotebookSerializer(serializers.ModelSerializer):
    """
    For Get method
    """

    storage_datetime = serializers.DateTimeField(format=Y_M_D_H_M_FORMAT)
    creditcard = serializers.CharField(source="creditcards.card_number")

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
        creditcard_data = validated_data.pop("creditcard")
        transaction_id = validated_data.pop("transaction_id")
        is_creditcard_stored = validated_data.pop("is_creditcard_stored")
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
        fields = "__all__"


class NoteBookSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source="store.name")
    row_notebook = GetRowNotebookSerializer(many=True, read_only=True)

    class Meta:
        model = NoteBook
        fields = "__all__"
        read_only_fields = ("id",)

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
        fields = "__all__"


class StoreSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(allow_blank=True, required=False)
    poses = POSSerializer(many=True, read_only=True)
    notebooks = NoteBookSerializer(many=True, read_only=True)
    users = ShortInfomationDetailSerializer(many=True, read_only=True)
    surcharge = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Store
        fields = "__all__"
        read_only_fields = ("id",)

    def validate_surcharge(self, value):
        if not value:
            return 0
        try:
            return int(value)
        except ValueError:
            raise serializers.ValidationError("You must supply an integer")


class BillPosSerializer(serializers.ModelSerializer):

    total_money = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = BillPos
        fields = "__all__"

    def validate_total_money(self, value):
        if not value:
            return 0
        try:
            return int(value)
        except ValueError:
            raise serializers.ValidationError("You must supply an integer")


class SwipeCardTransactionReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.infomation_detail.fullname", read_only=True)
    pos = POSSerializer()

    class Meta:
        model = SwipeCardTransaction
        fields = (
            "id",
            "customer_money_needed",
            "transaction_datetime_created",
            "user_name",
            "fee",
            "customer_name",
            "customer_phone_number",
            "pos",
        )


class CreditCardCustomerSerializer(serializers.Serializer):

    card_number = serializers.CharField(read_only=True)
    card_name = serializers.CharField(read_only=True)


class SwipeCardTransactionCustomerSerializer(serializers.Serializer):

    credit_card = CreditCardCustomerSerializer(read_only=True)
    phone_number = serializers.CharField()
    name = serializers.CharField(read_only=True)


class BankAccountSwipeCardTransactionDetailRetrieveUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = "__all__"


class CreditCardSwipeCardTransactionDetailRetrieveUpdateSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField()

    class Meta:
        model = CreditCard
        fields = "__all__"

    def validate_card_number(self, value):
        """
        Because this serializer only use for update data which is `card_number` can not be modified.
        """
        return value


class CustomerSwipeCardTransactionDetailRetrieveUpdateSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField()
    bank_account = BankAccountSwipeCardTransactionDetailRetrieveUpdateSerializer()
    credit_card = CreditCardSwipeCardTransactionDetailRetrieveUpdateSerializer()

    class Meta:
        model = Customer
        fields = "__all__"

    def validate_phone_number(self, value):
        """
        Because this serializer only use for update data which is `phone_number` can not be modified.
        """
        return value


class SwipeCardTransactionDetailRetrieveUpdateSerializer(serializers.ModelSerializer):
    customer = CustomerSwipeCardTransactionDetailRetrieveUpdateSerializer()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context["request"].method in ["GET"]:
                self.fields["user"] = serializers.CharField(source="user.id")
                self.fields["billpos"] = BillPosSerializer(source="billposes", many=True)
        except KeyError:
            pass
        except Exception as ex:
            print("Exception SwipeCardTransactionDetailRetrieveUpdateSerializer", ex)

    class Meta:
        model = SwipeCardTransaction
        fields = "__all__"
        depth = 2

    def update(self, instance: SwipeCardTransaction, validated_data):
        customer = validated_data.pop("customer")
        credit_card = customer.pop("credit_card")
        bank_account = customer.pop("bank_account", {})
        credit_card_obj: CreditCard = CreditCard.objects.get(card_number=credit_card.pop("card_number"))
        for attr, value in credit_card.items():
            setattr(credit_card_obj, attr, value)
        customer_obj: Customer = Customer.objects.get(phone_number=customer.pop("phone_number"))
        for attr, value in customer.items():
            setattr(customer_obj, attr, value)
        if customer_obj.bank_account:
            bank_account_obj: BankAccount = BankAccount.objects.get(id=customer_obj.bank_account.id)
            for attr, value in bank_account.items():
                setattr(bank_account_obj, attr, value)
        else:
            bank_account_obj: BankAccount = BankAccount.objects.create(**bank_account)
            customer_obj.bank_account = bank_account_obj
        bank_account_obj.save()
        customer_obj.save()
        credit_card_obj.save()
        return instance


class SwipeCardTransactionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    creditcard = CreditCardSerializer(write_only=True)
    customer = SwipeCardTransactionCustomerSerializer()
    transaction_datetime_created = serializers.DateTimeField(read_only=True, format=Y_M_D_H_M_FORMAT)
    transaction_datetime_updated = serializers.DateTimeField(read_only=True, format=Y_M_D_H_M_FORMAT)
    username = serializers.CharField(source="user.username", read_only=True)
    negative_money = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    credit_card_number = serializers.CharField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context["request"].method in ["GET"]:
                # self.fields['creditcard'] = serializers.SerializerMethodField()
                # self.fields['transaction_type'] = serializers.SerializerMethodField()
                self.fields["customer_id_card_front_image"] = serializers.SerializerMethodField()
                self.fields["customer_id_card_back_image"] = serializers.SerializerMethodField()
        except KeyError:
            pass
        except Exception as ex:
            print("Exception SwipeCardTransactionSerializer", ex)

    class Meta:
        model = SwipeCardTransaction
        fields = "__all__"

    def validate_negative_money(self, value):
        if not value:
            return 0
        try:
            return int(value)
        except ValueError:
            raise serializers.ValidationError("You must supply an integer")

    def get_creditcard(self, obj):
        serializer_context = {"request": self.context.get("request")}
        return serializer_context
        # serializer = CreditCardSerializer(obj.creditcard, context=serializer_context)
        # return serializer.data

    def create(self, validated_data):
        customer = validated_data.pop("customer")
        phone_number = customer.pop("phone_number")
        creditcard_data: dict = validated_data.pop("creditcard")
        card_number = creditcard_data.pop("card_number")
        creditcard_data.pop("credit_card_front_image", None)
        creditcard_data.pop("credit_card_back_image", None)
        creditcard_obj, _ = CreditCard.objects.get_or_create(card_number=card_number)
        for attr, val in creditcard_data.items():
            setattr(creditcard_obj, attr, val)
        creditcard_obj.save()
        customer_obj, _ = Customer.objects.get_or_create(
            phone_number=phone_number,
            credit_card=creditcard_obj,
        )
        instance = SwipeCardTransaction.objects.create(
            **validated_data, customer=customer_obj, credit_card_number=card_number
        )
        return instance

    # def update(self, instance: SwipeCardTransaction, validated_data):
    #     creditcard = validated_data.pop("creditcard", None)
    #     if creditcard:
    #         creditcard_instance = CreditCard.objects.filter(id=instance.creditcard.id).first()
    #         for attr, value in creditcard.items():
    #             setattr(creditcard_instance, attr, value)
    #         creditcard_instance.save()

    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()
    #     return instance

    def get_customer_id_card_front_image(self, obj):
        if obj.customer_id_card_front_image:
            return self.context["request"].build_absolute_uri(obj.customer_id_card_front_image.url)
        return ""

    def get_customer_id_card_back_image(self, obj):
        if obj.customer_id_card_back_image:
            return self.context["request"].build_absolute_uri(obj.customer_id_card_back_image.url)
        return ""


class StoreCostSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreCost
        fields = "__all__"


class CreditCardManagementSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    credit_card_number = serializers.CharField()
    store_name = serializers.CharField()
    customer_money_needed = serializers.IntegerField()
    transaction_datetime_created = serializers.DateTimeField(format=Y_M_D_H_M_FORMAT)


class AllTransaction4CreditCardSerializer(serializers.Serializer):

    store_name = serializers.CharField()
    customer_money_needed = serializers.IntegerField()
    transaction_datetime_created = serializers.DateTimeField(format=Y_M_D_H_M_FORMAT)
