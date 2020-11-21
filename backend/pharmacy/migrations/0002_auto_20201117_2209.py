# Generated by Django 3.1.2 on 2020-11-17 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pharmacy', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
            ],
        ),
        migrations.AddField(
            model_name='medicine',
            name='category',
            field=models.ManyToManyField(default='DefaultCategory', related_name='medicines', to='pharmacy.Category'),
        ),
    ]
