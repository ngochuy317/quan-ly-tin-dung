# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

from apps.base.constants import Y_M_D_H_M_FORMAT
from apps.customer.models import CreditCard, Customer
from apps.customer.serializers import CreditCardSerializer
from apps.store.models import (
    POS,
    BillPos,
    FeePos4CreditCard,
    NoteBook,
    Product,
    RowNotebook,
    Store,
    StoreCost,
    StoreMakePOS,
    SwipeCardTransaction,
)
from apps.store.serializers import ShortFeePos4CreditCardSerializer
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
    store_name = serializers.ReadOnlyField(source="infomation_detail.store.name")

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
    store_make_pos_name = serializers.ReadOnlyField(source="from_store.name")

    class Meta:
        model = POS
        fields = "__all__"
        read_only_fields = ("id",)


class POSSerializerDetail(serializers.ModelSerializer):
    fee4creditcard = ShortFeePos4CreditCardSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context["request"].method == "PUT":
                self.fields["store_id"] = serializers.IntegerField()
                self.fields["from_store_id"] = serializers.IntegerField()
            elif self.context["request"].method == "GET":
                self.fields["store_id"] = serializers.CharField(source="store.id")
                self.fields["from_store_id"] = serializers.CharField(source="from_store.id")
        except Exception as e:
            print("Exception |", e)

    class Meta:
        model = POS
        fields = "__all__"
        read_only_fields = ("id",)
        depth = 1

    def update(self, instance, validated_data):

        # Update store and store make POS
        store_id = validated_data.pop("store_id")
        from_store_id = validated_data.pop("from_store_id")
        store = Store.objects.filter(id=store_id).first()
        from_store = StoreMakePOS.objects.filter(id=from_store_id).first()
        if not all([store, from_store]):
            raise serializers.ValidationError("Can not found store or store make pos")
        instance.store = store
        instance.from_store = from_store

        fee4creditcard = validated_data.pop("fee4creditcard", [])
        for data in fee4creditcard:
            # Delete the choose one
            if data.pop("delete", False):
                fee_obj = FeePos4CreditCard.objects.filter(id=data["id"]).first()
                fee_obj.delete()

            # Update if delete flag not exist
            elif data.pop("exist", False):
                fee_obj = FeePos4CreditCard.objects.filter(id=data["id"]).first()
                for attr, value in data.items():
                    setattr(fee_obj, attr, value)
                fee_obj.save()

            # Create a new one if dont have flag delete or exist
            elif data.pop("new", None):
                FeePos4CreditCard.objects.create(**data, pos_machine=instance)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class GetRowNotebookSerializer(serializers.ModelSerializer):
    """
    For Get method
    """

    storage_datetime = serializers.DateTimeField(format=Y_M_D_H_M_FORMAT)
    creditcard = serializers.CharField(source="creditcard.card_number")

    class Meta:
        model = RowNotebook
        fields = "__all__"


class CreateRowNotebookSerializer(serializers.ModelSerializer):
    """
    For Post method
    """

    creditcard = CreditCardSerializer()

    class Meta:
        model = RowNotebook
        fields = "__all__"

    def create(self, validated_data):
        creditcard_data = validated_data.pop("creditcard")
        card_number = creditcard_data.pop("card_number")
        customer_data = creditcard_data.pop("customer")
        phone_number = customer_data.pop("phone_number")
        customer_obj, _ = Customer.objects.get_or_create(
            phone_number=phone_number,
        )
        for attr, val in customer_data.items():
            setattr(customer_obj, attr, val)
        customer_obj.save()

        creditcard_obj, _ = CreditCard.objects.get_or_create(card_number=card_number, customer=customer_obj)
        for attr, value in creditcard_data.items():
            setattr(creditcard_obj, attr, value)
        instance = RowNotebook.objects.create(**validated_data)
        creditcard_obj.notebook = instance
        creditcard_obj.save()
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


class StorePOSOnlySerializer(serializers.Serializer):

    poses = POSSerializer(many=True, read_only=True)


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


class POSNameMidTidSerializer(serializers.ModelSerializer):
    class Meta:
        model = POS
        fields = (
            "id",
            "name",
            "mid",
            "tid",
        )


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


class BillPosSwipeCardDetailSerializer(BillPosSerializer):
    pos = POSNameMidTidSerializer(read_only=True)

    class Meta:
        model = BillPos
        fields = "__all__"


class BillPosUpdateSerializer(serializers.ModelSerializer):

    exist = serializers.BooleanField(required=False)

    class Meta:
        model = BillPos
        exclude = ("bill_image",)


class SwipeCardTransactionReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.infomation_detail.fullname", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    customer_phone_number = serializers.CharField(source="customer.phone_number", read_only=True)
    # billposes = POSSerializer(many=True)

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
            # "pos",
        )


class CreditCardCustomerSerializer(serializers.Serializer):

    card_number = serializers.CharField(read_only=True)
    card_name = serializers.CharField(read_only=True)


class SwipeCardTransactionCustomerSerializer(serializers.Serializer):

    # credit_card = CreditCardCustomerSerializer(read_only=True)
    phone_number = serializers.CharField()
    name = serializers.CharField(allow_null=True, allow_blank=True)


class CustomerSwipeCardTransactionDetailRetrieveUpdateSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField()
    name = serializers.CharField(max_length=127, required=False)

    class Meta:
        model = Customer
        fields = "__all__"

    def validate_phone_number(self, value):
        """
        Because this serializer only use for update data which is `phone_number` can not be modified.
        """
        return value


class CreditCardSwipeCardTransactionDetailRetrieveUpdateSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField()
    customer = CustomerSwipeCardTransactionDetailRetrieveUpdateSerializer()

    class Meta:
        model = CreditCard
        fields = "__all__"

    def validate_card_number(self, value):
        """
        Because this serializer only use for update data which is `card_number` can not be modified.
        """
        return value


class SwipeCardTransactionDetailRetrieveUpdateSerializer(serializers.ModelSerializer):

    creditcard = CreditCardSwipeCardTransactionDetailRetrieveUpdateSerializer()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context["request"].method in ["GET"]:
                self.fields["user"] = serializers.CharField(source="user.id")
                self.fields["billpos"] = BillPosSwipeCardDetailSerializer(source="billposes", many=True)
        except KeyError:
            pass
        except Exception as ex:
            print("Exception SwipeCardTransactionDetailRetrieveUpdateSerializer", ex)

    class Meta:
        model = SwipeCardTransaction
        fields = "__all__"
        depth = 2

    def update(self, instance: SwipeCardTransaction, validated_data):
        creditcard = validated_data.pop("creditcard")
        card_number = creditcard.pop("card_number")
        customer = creditcard.pop("customer")
        phone_number = customer.pop("phone_number")

        customer_obj: Customer = Customer.objects.filter(phone_number=phone_number).first()
        if not customer_obj:
            customer_obj: Customer = Customer.objects.create(phone_number=phone_number, **customer)
        else:
            for attr, value in customer.items():
                setattr(customer_obj, attr, value)

        credit_card_obj: CreditCard = CreditCard.objects.filter(card_number=card_number).first()
        if not credit_card_obj:
            credit_card_obj: CreditCard = CreditCard.objects.create(
                card_number=card_number, customer=customer_obj, **creditcard
            )
        else:
            for attr, value in creditcard.items():
                setattr(credit_card_obj, attr, value)

        # update SwipeCardTransaction data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        customer_obj.save()
        credit_card_obj.customer = customer_obj
        credit_card_obj.save()
        instance.creditcard = credit_card_obj
        instance.save()
        return instance


class SwipeCardTransactionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    creditcard = CreditCardSerializer()
    customer = SwipeCardTransactionCustomerSerializer(write_only=True)
    transaction_datetime_created = serializers.DateTimeField(read_only=True, format=Y_M_D_H_M_FORMAT)
    transaction_datetime_updated = serializers.DateTimeField(read_only=True, format=Y_M_D_H_M_FORMAT)
    username = serializers.CharField(source="user.username", read_only=True)
    negative_money = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    credit_card_number = serializers.CharField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context["request"].method in ["GET"]:
                ...
                # self.fields['creditcard'] = serializers.SerializerMethodField()
                # self.fields['transaction_type'] = serializers.SerializerMethodField()
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
        customer_obj, _ = Customer.objects.get_or_create(
            phone_number=phone_number,
        )
        for attr, val in customer.items():
            setattr(customer_obj, attr, val)
        customer_obj.save()

        creditcard_data: dict = validated_data.pop("creditcard")
        card_number = creditcard_data.pop("card_number")
        creditcard_data.pop("credit_card_front_image", None)
        creditcard_data.pop("credit_card_back_image", None)

        creditcard_obj = CreditCard.objects.filter(card_number=card_number).first()
        if not creditcard_obj:
            creditcard_obj = CreditCard.objects.create(card_number=card_number, customer=customer_obj)
        else:
            creditcard_obj.customer = customer_obj

        for attr, val in creditcard_data.items():
            setattr(creditcard_obj, attr, val)
        creditcard_obj.save()
        instance = SwipeCardTransaction.objects.create(**validated_data, creditcard=creditcard_obj)
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
    card_number = serializers.ReadOnlyField(source="creditcard__card_number")
    creditcard_id = serializers.ReadOnlyField(source="creditcard__id")
    store_name = serializers.CharField()
    customer_money_needed = serializers.IntegerField()
    transaction_datetime_created = serializers.DateTimeField(format=Y_M_D_H_M_FORMAT)


class AllTransaction4CreditCardSerializer(serializers.Serializer):

    store_name = serializers.CharField()
    customer_money_needed = serializers.IntegerField()
    transaction_datetime_created = serializers.DateTimeField(format=Y_M_D_H_M_FORMAT)
