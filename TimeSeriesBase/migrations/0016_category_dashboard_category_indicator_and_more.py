# Generated by Django 4.2.6 on 2024-05-21 09:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0015_alter_dashboardtopic_icon'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='dashboard_category_indicator',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='TimeSeriesBase.indicator'),
        ),
        migrations.AddField(
            model_name='category',
            name='dashboard_topic',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='TimeSeriesBase.dashboardtopic'),
        ),
    ]
