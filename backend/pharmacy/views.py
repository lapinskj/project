from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import JsonResponse
from pharmacy.models import *
from pharmacy.serializers import *
from rest_framework.decorators import action
from rest_framework import viewsets, status
from django_filters import rest_framework as filters
from .permissions import *
from django.core.mail import send_mail
from datetime import date, timedelta, datetime


# Filter class
class CustomerFilter(filters.FilterSet):
    pesel = filters.NumberFilter(field_name='pesel', lookup_expr='contains')

    class Meta:
        model = Customer
        fields = ['pesel']


class MedicineFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='contains')
    price = filters.CharFilter(field_name='price', lookup_expr='contains')
    quantity = filters.CharFilter(field_name='quantity', lookup_expr='contains')
    brand = filters.CharFilter(field_name='brand', lookup_expr='contains')
    capacity = filters.CharFilter(field_name='capacity', lookup_expr='contains')
    dose = filters.CharFilter(field_name='dose', lookup_expr='contains')

    class Meta:
        model = Medicine
        fields = ['name', 'price', 'quantity', 'brand', 'capacity', 'dose']


# Model viewsets
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filterset_class = CustomerFilter

    def get_permissions(self):
        permission_classes = []
        if self.action in ('list', 'retrieve', 'partial_update'):
            permission_classes = [IsLoggedInUserOrAdmin]
        elif self.action in ('create', 'destroy', 'update'):
            permission_classes = [IsStaff]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Customer.objects.all()
        is_staff = self.request.user.is_staff
        if not is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return CustomerSerializer
        return CustomerSerializerUser

    @action(detail=False, methods=['get'], url_path='countCustomers')
    def count_customers(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        queryset = self.filter_queryset(self.get_queryset())
        count = queryset.count()
        content = {'count': count}
        return Response(content)


def days_cur_month():
    m = datetime.now().month
    y = datetime.now().year
    ndays = (date(y, m+1, 1) - date(y, m, 1)).days
    d1 = date(y, m, 1)
    d2 = date(y, m, ndays)
    delta = d2 - d1

    return [(d1 + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(delta.days + 1)]


class MedicineOrderViewSet(viewsets.ModelViewSet):
    queryset = MedicineOrder.objects.all()
    serializer_class = MedicineOrderSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action in ('create', 'list', 'retrieve'):
            permission_classes = [IsLoggedInUserOrAdmin]
        elif self.action in ('destroy', 'update', 'partial_update'):
            permission_classes = [IsStaff]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return MedicineOrderSerializerList
        return MedicineOrderSerializer

    def get_queryset(self):
        queryset = MedicineOrder.objects.all()
        is_staff = self.request.user.is_staff
        if not is_staff:
            queryset = queryset.filter(customer__user=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):
        order_items = request.data.get('medicineOrderItems')
        for order_item in order_items:
            medicine = Medicine.objects.get(pk=order_item['medicine'])
            if medicine.quantity < int(order_item['amount']):
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

        return super(MedicineOrderViewSet, self).create(request, *args, **kwargs)

    def destroy(self, request, pk=None, *args, **kwargs):
        if pk:
            medicine_order = MedicineOrder.objects.get(id=pk)
            order_items = medicine_order.medicineOrderItems.all()
            for orderItem in order_items:
                medicine_pk = orderItem.medicine.id
                medicine = Medicine.objects.get(pk=medicine_pk)
                medicine.quantity = medicine.quantity + orderItem.amount
                medicine.save()
        return super(MedicineOrderViewSet, self).destroy(request, *args, **kwargs)

    @action(detail=True, methods=['put'], url_path='updateStatus')
    def update_order_status(self, request, pk=None):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        order_status = request.data.get('orderStatus')
        if pk:
            medicine_order = MedicineOrder.objects.get(id=pk)
            medicine_order.orderStatus = order_status
            medicine_order.save()
            serializer = MedicineOrderSerializerList(medicine_order)
            if medicine_order.customer.user and not medicine_order.customer.user.is_staff:
                title = ['Your order is ', str(order_status.lower())]
                title = ''.join(title)
                content = ["We would like to inform that order number ", str(medicine_order.id),
                           ' has changed status to ', str(order_status.lower()), "."]
                content = ''.join(content)
                email = medicine_order.customer.user.email
                send_mail(title, content, 'from@example.com', [email])
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='countOrders')
    def count_orders(self, request):
        today = date.today()
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(orderStatus='Finished', created__month=today.month)
        count = queryset.count()
        content = {'count': count}
        return Response(content)

    @action(detail=False, methods=['get'], url_path='countRevenue')
    def count_revenue(self, request):
        today = date.today()
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(orderStatus='Finished', created__month=today.month)
        revenue = 0
        for order in queryset:
            revenue = revenue + order.total_price
        content = {'revenue': revenue}
        return Response(content)

    @action(detail=False, methods=['get'], url_path='orderStatistics')
    def order_statistics(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        results = []
        for day in days_cur_month():
            queryset = self.filter_queryset(self.get_queryset())
            queryset = queryset.filter(orderStatus='Placed', created=day)
            count = queryset.count()
            results.append({'day': day, 'count': count})
        return JsonResponse(results, safe=False)


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    filterset_class = MedicineFilter
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return MedicineListSerializer
        return MedicineSerializer

    @action(detail=False, methods=['get'], url_path='countMedicines')
    def count_medicines(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        queryset = self.filter_queryset(self.get_queryset())
        count = queryset.count()
        content = {'count': count}
        return Response(content)

    @action(detail=False, methods=['get'], url_path='medicineStatistics')
    def medicine_statistics(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        queryset = self.filter_queryset(self.get_queryset())
        order_items = MedicineOrderItem.objects.all()
        results = []
        for medicine in queryset:
            order_items_medicine = order_items.filter(medicine=medicine)
            total_amount = 0
            for item in order_items_medicine:
                total_amount = total_amount + item.amount
            serializer = MedicineListSerializer(medicine)
            results.append({'medicine': serializer.data, 'total_amount': total_amount})
        results.sort(key=lambda x: x.get('total_amount'), reverse=True)
        return JsonResponse(results, safe=False)


class MedicineOrderItemViewSet(viewsets.ModelViewSet):
    queryset = MedicineOrderItem.objects.all()
    serializer_class = MedicineOrderItemGetSerializerFull

    def create(self, request, *args, **kwargs):
        medicine_order_id = request.data.get('medicineOrder')
        medicine_order = MedicineOrder.objects.get(pk=medicine_order_id)
        amount = int(request.data.get('amount'))
        medicine_id = request.data.get('medicine')
        medicine = Medicine.objects.get(pk=medicine_id)
        medicine_quantity = medicine.quantity
        if medicine_quantity < amount:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        medicine.quantity = medicine_quantity - amount
        medicine.save()
        medicine_order.total_price = medicine_order.total_price + (amount * medicine.price)
        medicine_order.save()
        serializer = MedicineOrderItemCreateSerializerFull(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        if pk:
            medicine_order_item = MedicineOrderItem.objects.get(id=pk)
            amount = medicine_order_item.amount
            medicine = Medicine.objects.get(pk=medicine_order_item.medicine.id)
            medicine_quantity = medicine.quantity
            medicine.quantity = medicine_quantity + amount
            medicine.save()
            medicine_order = MedicineOrder.objects.get(id=medicine_order_item.medicineOrder.id)
            medicine_order.total_price = medicine_order.total_price - (amount * medicine.price)
            medicine_order.save()
        return super(MedicineOrderItemViewSet, self).destroy(request, *args, **kwargs)

    def get_queryset(self):
        queryset = MedicineOrderItem.objects.all()
        is_staff = self.request.user.is_staff
        if not is_staff:
            queryset = queryset.filter(medicineOrder__customer__user=self.request.user)
        return queryset

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return MedicineOrderItemGetSerializerFull
        return MedicineOrderItemCreateSerializerFull

    def get_permissions(self):
        permission_classes = []
        if self.action in ('create', 'list', 'retrieve', 'destroy'):
            permission_classes = [IsLoggedInUserOrAdmin]
        elif self.action in ('update', 'partial_update'):
            permission_classes = [IsStaff]
        return [permission() for permission in permission_classes]


class NoteViewset(viewsets.ModelViewSet):
    queryset = OrderNote.objects.all()
    serializer_class = NoteSerializer
    filterset_fields = ('order',)

    def get_serializer_class(self):
        if self.request.method in ['GET', 'DELETE']:
            return NoteSerializer
        return NoteCreateSerializer

    def get_permissions(self):
        permission_classes = []
        if self.action in ('create', 'list', 'retrieve'):
            permission_classes = [IsLoggedInUserOrAdmin]
        elif self.action in ('update', 'partial_update', 'destroy'):
            permission_classes = [IsStaff]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = OrderNote.objects.all()
        is_staff = self.request.user.is_staff
        if not is_staff:
            queryset = queryset.filter(order__customer__user=self.request.user)
        return queryset


class NewOrderMessageViewSet(viewsets.ModelViewSet):
    queryset = NewOrderMessage.objects.all()
    serializer_class = NewOrderMessageSerializer
    permission_classes = [IsStaff]

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return NewOrderMessageSerializerList
        return NewOrderMessageSerializer

    @action(detail=False, methods=['get'], url_path='countUnread')
    def count_unread(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(unread=True)
        count = queryset.count()
        content = {'count': count}
        return Response(content)

    @action(detail=True, methods=['put'], url_path='updateMessageRead')
    def update_message_read(self, request, pk=None):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        message_unread = request.data.get('unread')
        if pk:
            order_message = NewOrderMessage.objects.get(id=pk)
            order_message.unread = message_unread
            order_message.save()
            serializer = NewOrderMessageSerializer(order_message)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['delete'], url_path='deleteAllRead')
    def delete_all_read(self, request):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        NewOrderMessage.objects.filter(unread=False).delete()
        return Response(status=status.HTTP_200_OK)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]


