from django.dispatch import receiver
from django.db.models.signals import post_save
from pharmacy.models import MedicineOrder, NewOrderMessage


@receiver(post_save, sender=MedicineOrder)
def new_order_message(sender, instance, created, **kwargs):
    if created:
        NewOrderMessage.objects.create(medicine_order=instance)
        instance.newOrderMessage.save()


