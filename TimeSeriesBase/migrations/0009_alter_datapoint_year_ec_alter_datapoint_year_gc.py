# Generated by Django 4.2.6 on 2023-10-16 06:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0008_alter_datapoint_year_end_ec_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datapoint',
            name='year_EC',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='datapoint',
            name='year_GC',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
