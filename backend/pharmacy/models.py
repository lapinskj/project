from django.db import models

NEW = 'Rozpoczęte'
PROCESSED = 'W trakcie realizacji'
READY = 'Gotowe do odbioru'
FINISHED = 'Zakończone'
ORDER_STATUSES = (
    (NEW, NEW),
    (PROCESSED, PROCESSED),
    (READY, READY),
    (FINISHED, FINISHED)
)


class Customer(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    pesel = models.IntegerField()

    def __str__(self):
        return f'({self.id}) {self.pesel} {self.name} {self.surname}'


class MedicineOrder(models.Model):
    customer = models.ForeignKey(Customer, related_name='medicineOrders', on_delete=models.CASCADE)
    total_price = models.FloatField(default=0)
    orderStatus = models.CharField(max_length=100, choices=ORDER_STATUSES, default=NEW)
    created = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f'({self.id} {self.created}) {self.customer} {self.total_price}'


class Medicine(models.Model):
    name = models.CharField(max_length=25)
    price = models.FloatField()

    def __str__(self):
        return f'({self.id}) {self.name} {self.price}'


class MedicineOrderItem(models.Model):
    medicineOrder = models.ForeignKey(MedicineOrder, related_name="medicineOrderItems", on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    amount = models.IntegerField(default=1)
