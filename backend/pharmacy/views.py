from rest_framework import viewsets, status
from rest_framework.response import Response
from pharmacy.models import *
from pharmacy.serializers import *
from rest_framework.decorators import action, permission_classes
from rest_framework import viewsets, status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import django_filters
from django_filters import rest_framework as filters
from .permissions import *
from django.core.mail import send_mail


# Filter class
class CustomerFilter(filters.FilterSet):
    pesel = filters.NumberFilter(field_name='pesel', lookup_expr='contains')

    class Meta:
        model = Customer
        fields = ['pesel']


class MedicineFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='contains')

    class Meta:
        model = Medicine
        fields = ['name']


# Model viewsets
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filterset_class = CustomerFilter

    def get_permissions(self):
        permission_classes = []
        if self.action in ('list', 'retrieve', 'update', 'partial_update'):
            permission_classes = [IsLoggedInUserOrAdmin]
        elif self.action in ('create', 'destroy'):
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
            if not medicine_order.customer.user.is_staff:
                email = medicine_order.customer.user.email
                send_mail('Test wysyłania mejli xd', order_status, 'from@example.com', [email])
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    filterset_class = MedicineFilter
    permission_classes = [IsStaffOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return MedicineListSerializer
        return MedicineSerializer


class MedicineOrderItemViewSet(viewsets.ModelViewSet):
    queryset = MedicineOrderItem.objects.all()
    serializer_class = MedicineOrderItemSerializer

    def get_queryset(self):
        queryset = MedicineOrderItem.objects.all()
        is_staff = self.request.user.is_staff
        if not is_staff:
            queryset = queryset.filter(medicineOrder__customer__user=self.request.user)
        return queryset

    def get_permissions(self):
        permission_classes = []
        if self.action in ('create', 'list', 'retrieve', 'destroy'):
            permission_classes = [IsLoggedInUserOrAdmin]
        elif self.action in ('update', 'partial_update'):
            permission_classes = [IsStaff]
        return [permission() for permission in permission_classes]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]

