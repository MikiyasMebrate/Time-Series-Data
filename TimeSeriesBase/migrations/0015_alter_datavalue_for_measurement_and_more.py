# Generated by Django 4.2.6 on 2023-10-23 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0014_remove_location_user_remove_topic_for_location_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datavalue',
            name='for_measurement',
            field=models.ManyToManyField(null=True, to='TimeSeriesBase.measurement'),
        ),
        migrations.AlterField(
            model_name='datavalue',
            name='for_source',
            field=models.ManyToManyField(null=True, to='TimeSeriesBase.source'),
        ),
    ]
