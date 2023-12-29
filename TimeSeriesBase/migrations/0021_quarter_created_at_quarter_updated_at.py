# Generated by Django 4.2.6 on 2023-12-20 17:55

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0020_alter_datapoint_options_alter_month_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='quarter',
            name='created_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='quarter',
            name='updated_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]