# Generated by Django 4.2.6 on 2023-11-20 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0003_datavalue_is_deleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='topic',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]