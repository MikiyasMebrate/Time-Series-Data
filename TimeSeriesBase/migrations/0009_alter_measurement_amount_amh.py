# Generated by Django 4.2.6 on 2023-11-23 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0008_remove_measurement_measure'),
    ]

    operations = [
        migrations.AlterField(
            model_name='measurement',
            name='Amount_AMH',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]