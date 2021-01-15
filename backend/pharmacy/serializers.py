from rest_framework import serializers
from pharmacy.models import *
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from djoser.serializers import UserCreateSerializer, UserSerializer
User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'surname', 'phone_number', 'pesel', 'password', 'is_staff')


class UserMeSerializer(UserSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'surname', 'phone_number', 'pesel', 'is_staff')


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class CustomerSerializerUser(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'name', 'surname', 'pesel')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderNote
        fields = '__all__'


class NewOrderMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewOrderMessage
        fields = '__all__'


# GET serializers
class MedicineListSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    image = serializers.ImageField()

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
    notes = NoteSerializer(many=True)

    class Meta:
        model = MedicineOrder
        fields = ('id', 'customer', 'total_price', 'orderStatus', 'medicineOrderItems', 'created', 'notes')


class NewOrderMessageSerializerList(serializers.ModelSerializer):
    medicine_order = MedicineOrderSerializerList()

    class Meta:
        model = NewOrderMessage
        fields = '__all__'


# POST / PUT serializers
class NoteCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = OrderNote
        fields = ('id', 'order', 'author', 'content', 'user')

    def create(self, validated_data):
        note = OrderNote.objects.create(user=self.context['request'].user, **validated_data)
        medicine_order = MedicineOrder.objects.get(id=self.context['request'].data.get('order'))
        if self.context['request'].user.is_staff and medicine_order.customer.user:
            email = medicine_order.customer.user.email
            title = ["New note in order number ", str(medicine_order.id)]
            title = ''.join(title)
            content = ["We would like to inform that Pharmacist has added new note to order number ",
                       str(medicine_order.id)]
            content = ''.join(content)
            send_mail(title, content, 'from@example.com', [email])
        return note


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'


class MedicineOrderItemCreateSerializerFull(serializers.ModelSerializer):
    class Meta:
        model = MedicineOrderItem
        fields = ('medicineOrder', 'medicine', 'amount')


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
            medicine.quantity = medicine.quantity - orderItem['amount']
            medicine.save()
            total_price = total_price + (orderItem['amount'] * medicine.price)
            MedicineOrderItem.objects.create(medicineOrder=medicine_order, **orderItem)
        medicine_order.total_price = total_price
        medicine_order.save()
        return medicine_order


