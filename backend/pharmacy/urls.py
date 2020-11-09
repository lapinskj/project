from django.urls import path, include
from rest_framework.routers import DefaultRouter
from pharmacy import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet)
router.register(r'medicineOrders', views.MedicineOrderViewSet)
router.register(r'medicines', views.MedicineViewSet)
router.register(r'medicineOrderItem', views.MedicineOrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
