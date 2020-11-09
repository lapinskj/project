from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from pharmacy.models import Customer, MedicineOrder, Medicine, MedicineOrderItem
from pharmacy.serializers import *
from rest_framework.decorators import action


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_queryset(self):
        queryset = Customer.objects.all()
        pesel = self.request.query_params.get('pesel', None)
        if pesel:
            queryset = queryset.filter(pesel__icontains=pesel)
        print(queryset)
        return queryset


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

    def get_queryset(self):
        queryset = Medicine.objects.all()
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset


class MedicineOrderItemViewSet(viewsets.ModelViewSet):
    queryset = MedicineOrderItem.objects.all()
    serializer_class = MedicineOrderItemSerializer
