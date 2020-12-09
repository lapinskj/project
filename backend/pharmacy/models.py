from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField
from django.db.models.base import ObjectDoesNotExist

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


class UserAccountManager(BaseUserManager):
    def create_user(self, name, surname, email, phone_number, pesel, is_staff, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(name=name, surname=surname, email=email, phone_number=phone_number, pesel=pesel,
                          is_staff=is_staff)

        user.set_password(password)
        user.save()

        if not is_staff:
            try:
                existing_customer = Customer.objects.get(pesel=pesel)
                existing_customer.user = user
                existing_customer.save()
            except ObjectDoesNotExist:
                customer = Customer(name=name, surname=surname, pesel=pesel, user=user)
                customer.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class UserAccount(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    phone_number = PhoneNumberField()
    pesel = models.IntegerField(default=00000000000)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'surname', 'is_staff', 'phone_number', 'pesel']

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

    def __str__(self):
        return f'({self.email} {self.name} {self.surname}'


class Customer(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    pesel = models.IntegerField()
    user = models.ForeignKey(UserAccount, on_delete=models.DO_NOTHING, null=True)

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


class Category(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=150)


class Medicine(models.Model):
    name = models.CharField(max_length=25)
    price = models.FloatField()
    brand = models.CharField(max_length=30)
    capacity = models.CharField(max_length=30)
    dose = models.CharField(max_length=30)
    category = models.ManyToManyField(Category, related_name='medicines')

    def __str__(self):
        return f'({self.id}) {self.name} {self.brand} {self.capacity} {self.dose} {self.price}'


class MedicineOrderItem(models.Model):
    medicineOrder = models.ForeignKey(MedicineOrder, related_name="medicineOrderItems", on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    amount = models.IntegerField(default=1)
