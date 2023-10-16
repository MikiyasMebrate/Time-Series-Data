# Generated by Django 4.2.6 on 2023-10-16 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0007_alter_indicator_for_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datapoint',
            name='year_end_EC',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='datapoint',
            name='year_end_GC',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='datapoint',
            name='year_start_EC',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='datapoint',
            name='year_start_GC',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='for_category',
            field=models.ManyToManyField(blank=True, to='TimeSeriesBase.category'),
        ),
    ]