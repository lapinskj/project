from rest_framework import routers
from pharmacy import views

router = routers.DefaultRouter()
router.register('customers', views.CustomerViewSet)
router.register('medicineOrders', views.MedicineOrderViewSet)
router.register('medicines', views.MedicineViewSet)
router.register('medicineOrderItem', views.MedicineOrderItemViewSet)
router.register('categories', views.CategoryViewSet)
