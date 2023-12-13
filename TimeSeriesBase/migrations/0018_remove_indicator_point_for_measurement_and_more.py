# Generated by Django 4.2.6 on 2023-12-11 08:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0017_remove_book_user_delete_location_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='indicator_point',
            name='for_measurement',
        ),
        migrations.AlterField(
            model_name='indicator_point',
            name='for_datapoint',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='TimeSeriesBase.datapoint'),
        ),
        migrations.AlterField(
            model_name='indicator_point',
            name='for_indicator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='TimeSeriesBase.indicator'),
        ),
    ]
