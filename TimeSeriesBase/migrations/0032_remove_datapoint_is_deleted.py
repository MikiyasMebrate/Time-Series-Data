# Generated by Django 4.2.6 on 2024-01-10 18:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0031_alter_indicator_title_eng'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datapoint',
            name='is_deleted',
        ),
    ]
