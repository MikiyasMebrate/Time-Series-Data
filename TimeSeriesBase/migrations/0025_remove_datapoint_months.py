# Generated by Django 4.2.6 on 2024-01-01 09:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0024_month_number'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datapoint',
            name='months',
        ),
    ]
