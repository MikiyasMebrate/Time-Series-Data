# Generated by Django 4.2.6 on 2023-10-16 06:25

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0009_alter_datapoint_year_ec_alter_datapoint_year_gc'),
    ]

    operations = [
        migrations.AddField(
            model_name='datapoint',
            name='created_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='datapoint',
            name='updated_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
