import os
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
    def create_user(self, name, surname, email, phone_number, pesel, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(name=name, surname=surname, email=email, phone_number=phone_number, pesel=pesel,
                          is_staff=False)

        user.set_password(password)
        user.save()

        try:
            existing_customer = Customer.objects.get(pesel=pesel)
            existing_customer.user = user
            existing_customer.save()
        except ObjectDoesNotExist:
                customer = Customer(name=name, surname=surname, pesel=pesel, user=user)
                customer.save()

        return user

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = email.lower()
        if self.model.objects.filter(email=email).exists():
            raise ValueError('This email is already in use')
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')

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
    REQUIRED_FIELDS = ['name', 'surname', 'phone_number', 'pesel']

    def __str__(self):
        return f'({self.email} {self.name} {self.surname}'


class Customer(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    pesel = models.IntegerField()
    user = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f'({self.id}) {self.pesel} {self.name} {self.surname}'


class MedicineOrder(models.Model):
    customer = models.ForeignKey(Customer, related_name='medicineOrders', on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    orderStatus = models.CharField(max_length=100, choices=ORDER_STATUSES, default=NEW)
    created = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-created', '-id']

    def __str__(self):
        return f'({self.id} {self.created}) {self.customer} {self.total_price}'


class NewOrderMessage(models.Model):
    medicine_order = models.OneToOneField(MedicineOrder, on_delete=models.CASCADE, related_name='newOrderMessage')
    started = models.DateTimeField(auto_now_add=True)
    unread = models.BooleanField(default=True)


class Category(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=150)


def get_image_path(instance, filename):
    fn, ext = os.path.splitext(filename)
    return os.path.join('medicines', str(instance.id)+ext)


class Medicine(models.Model):
    name = models.CharField(max_length=25)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)
    brand = models.CharField(max_length=30)
    capacity = models.CharField(max_length=30)
    dose = models.CharField(max_length=30)
    image = models.ImageField(upload_to=get_image_path, blank=True, null=True)
    category = models.ForeignKey(Category, related_name='medicines', on_delete=models.SET_DEFAULT, default=1)

    def save(self, *args, **kwargs):
        if self.id is None:
            saved_image = self.image
            self.image = None
            super(Medicine, self).save(*args, **kwargs)
            self.image = saved_image
            if 'force_insert' in kwargs:
                kwargs.pop('force_insert')
        super(Medicine, self).save(*args, **kwargs)

    def __str__(self):
        return f'({self.id}) {self.name} {self.brand} {self.capacity} {self.dose} {self.price}'


class MedicineOrderItem(models.Model):
    medicineOrder = models.ForeignKey(MedicineOrder, related_name="medicineOrderItems", on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    amount = models.IntegerField(default=1)
