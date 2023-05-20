from rest_framework import serializers

from apps.user.models import User, InfomationDetail
from apps.store.models import Store, POS, NoteBook
    

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


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Store
        fields = '__all__'
        read_only_fields = ('id', )


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
