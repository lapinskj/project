from django.contrib import admin
from pharmacy.models import Customer


# Register your models here.
class CustomerAdmin(admin.ModelAdmin):
    pass


admin.site.register(Customer, CustomerAdmin)