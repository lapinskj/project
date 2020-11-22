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
    permission_classes = [IsStaff]

#    def get_queryset(self):
#        queryset = Customer.objects.all()
#        pesel = self.request.query_params.get('pesel', None)
#        if pesel:
#            queryset = queryset.filter(pesel__icontains=pesel)
#        print(queryset)
#        return queryset


class MedicineOrderViewSet(viewsets.ModelViewSet):
    queryset = MedicineOrder.objects.all()
    serializer_class = MedicineOrderSerializer

#    def list(self, request, *args, **kwargs):
#        queryset = MedicineOrder.objects.all()
#        serializer = MedicineOrderSerializerList(queryset, many=True)
#        return Response(serializer.data)
    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return MedicineOrderSerializerList
        return MedicineOrderSerializer

    @action(detail=True, methods=['put'], url_path='updateStatus')
    def update_order_status(self, request, pk=None):
        order_status = request.data.get('orderStatus')
        if pk:
            medicine_order = MedicineOrder.objects.get(id=pk)
            medicine_order.orderStatus = order_status
            medicine_order.save()
            serializer = MedicineOrderSerializerList(medicine_order)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    filterset_class = MedicineFilter
    permission_classes = [IsStaffOrReadOnly]

#    def get_queryset(self):
#        queryset = Medicine.objects.all()
#        name = self.request.query_params.get('name', None)
#        if name:
#            queryset = queryset.filter(name__icontains=name)
#        return queryset

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return MedicineListSerializer
        return MedicineSerializer


class MedicineOrderItemViewSet(viewsets.ModelViewSet):
    queryset = MedicineOrderItem.objects.all()
    serializer_class = MedicineOrderItemSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]

