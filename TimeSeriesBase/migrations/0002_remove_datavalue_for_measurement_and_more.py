# Generated by Django 4.2.6 on 2023-11-09 05:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datavalue',
            name='for_measurement',
        ),
        migrations.AddField(
            model_name='indicator_point',
            name='for_measurement',
            field=models.ManyToManyField(blank=True, to='TimeSeriesBase.measurement'),
        ),
        migrations.AlterField(
            model_name='datavalue',
            name='for_datapoint',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='TimeSeriesBase.datapoint'),
        ),
        migrations.AlterField(
            model_name='datavalue',
            name='for_month',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='TimeSeriesBase.month'),
        ),
        migrations.AlterField(
            model_name='datavalue',
            name='for_quarter',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='TimeSeriesBase.quarter'),
        ),
    ]