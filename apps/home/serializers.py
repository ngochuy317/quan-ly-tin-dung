from rest_framework import serializers

from apps.user.models import User, InfomationDetail
from apps.store.models import Store, POS
    

class InfomationDetailSerializer(serializers.ModelSerializer):
    store = serializers.ReadOnlyField(source='store.name')
    store_id = serializers.ReadOnlyField(source='store.id')

    class Meta:
        model = InfomationDetail
        fields = fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    infomation_detail = InfomationDetailSerializer()

    class Meta:
        model = User
        fields = fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Store
        fields = '__all__'
        read_only_fields = ('id', )


class POSSerializer(serializers.ModelSerializer):

    class Meta:
        model = POS
        fields = '__all__'
        read_only_fields = ('id', )
