# Generated by Django 3.1.2 on 2020-12-14 22:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pharmacy', '0005_auto_20201212_2300'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicine',
            name='quantity',
            field=models.PositiveIntegerField(default=10),
        ),
    ]
