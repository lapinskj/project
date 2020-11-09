from rest_framework import serializers
from pharmacy.models import Customer, MedicineOrder, Medicine, MedicineOrderItem


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'


class MedicineOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineOrderItem
        fields = '__all__'


# GET serializers
class MedicineListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ('id', 'name', 'price', 'brand', 'capacity', 'dose')


class MedicineOrderItemListSerializer(serializers.ModelSerializer):
    medicine = MedicineListSerializer()
    class Meta:

        model = MedicineOrderItem
        fields = ('id', 'medicine', 'amount')


class MedicineOrderSerializerList(serializers.ModelSerializer):
    customer = CustomerSerializer()
    medicineOrderItems = MedicineOrderItemListSerializer(many=True)

    class Meta:
        model = MedicineOrder
        fields = ('id', 'customer', 'total_price', 'orderStatus', 'medicineOrderItems', 'created')


# POST / PUT serializers
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
        print(validated_data)
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


