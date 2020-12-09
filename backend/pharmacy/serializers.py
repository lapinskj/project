from rest_framework import serializers
from pharmacy.models import *
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from djoser.serializers import UserCreateSerializer, UserSerializer
User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password', 'is_staff')


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class CustomerSerializerUser(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'name', 'surname')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'


# GET serializers
class MedicineListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True)

    class Meta:
        model = Medicine
        fields = '__all__'


class MedicineOrderItemGetSerializerFull(serializers.ModelSerializer):
    medicine = MedicineListSerializer()

    class Meta:
        model = MedicineOrderItem
        fields = '__all__'


class MedicineOrderItemGetSerializer(serializers.ModelSerializer):
    medicine = MedicineListSerializer()

    class Meta:
        model = MedicineOrderItem
        fields = ('id', 'medicine', 'amount')


class MedicineOrderSerializerList(serializers.ModelSerializer):
    customer = CustomerSerializer()
    medicineOrderItems = MedicineOrderItemGetSerializer(many=True)

    class Meta:
        model = MedicineOrder
        fields = ('id', 'customer', 'total_price', 'orderStatus', 'medicineOrderItems', 'created')


# POST / PUT serializers
class MedicineOrderItemCreateSerializerFull(serializers.ModelSerializer):
    class Meta:
        model = MedicineOrderItem
        fields = '__all__'

    def create(self, validated_data):
        medicine_order_id = validated_data['medicineOrder'].id
        medicine_order = MedicineOrder.objects.get(pk=medicine_order_id)
        amount = validated_data['amount']
        medicine_price = validated_data['medicine'].price
        medicine_order.total_price = medicine_order.total_price + amount * medicine_price
        medicine_order.save()
        medicine_order_item = MedicineOrderItem.objects.create(**validated_data)
        return medicine_order_item


class MedicineOrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineOrderItem
        fields = ('medicine', 'amount')


class MedicineOrderSerializer(serializers.ModelSerializer):
    medicineOrderItems = MedicineOrderItemCreateSerializer(many=True)

    class Meta:
        model = MedicineOrder
        fields = '__all__'

    def create(self, validated_data):
        order_items = validated_data.pop('medicineOrderItems')
        medicine_order = MedicineOrder.objects.create(**validated_data)
        total_price = 0
        for orderItem in order_items:
            medicine_pk = orderItem['medicine'].id
            medicine = Medicine.objects.get(pk=medicine_pk)
            total_price = total_price + (orderItem['amount'] * medicine.price)
            MedicineOrderItem.objects.create(medicineOrder=medicine_order, **orderItem)
        medicine_order.total_price = total_price
        medicine_order.save()
        return medicine_order


