# Generated by Django 3.1.2 on 2020-12-12 23:00

from django.db import migrations, models
import pharmacy.models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('pharmacy', '0004_auto_20201122_1939'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicine',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=pharmacy.models.get_image_path),
        ),
        migrations.AlterField(
            model_name='useraccount',
            name='phone_number',
            field=phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None),
        ),
        migrations.AlterField(
            model_name='useraccount',
            name='surname',
            field=models.CharField(max_length=255),
        ),
    ]
