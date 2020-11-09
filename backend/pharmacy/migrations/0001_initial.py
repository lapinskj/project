# Generated by Django 3.1.2 on 2020-11-09 18:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('surname', models.CharField(max_length=20)),
                ('pesel', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Medicine',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=25)),
                ('price', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='MedicineOrder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_price', models.FloatField(default=0)),
                ('orderStatus', models.CharField(choices=[('Rozpoczęte', 'Rozpoczęte'), ('W trakcie realizacji', 'W trakcie realizacji'), ('Gotowe do odbioru', 'Gotowe do odbioru'), ('Zakończone', 'Zakończone')], default='Rozpoczęte', max_length=100)),
                ('created', models.DateField(auto_now_add=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medicineOrders', to='pharmacy.customer')),
            ],
            options={
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='MedicineOrderItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField(default=1)),
                ('medicine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pharmacy.medicine')),
                ('medicineOrder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medicineOrderItems', to='pharmacy.medicineorder')),
            ],
        ),
    ]