# Generated by Django 4.2.6 on 2024-01-23 17:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("TimeSeriesBase", "0002_indicator_op_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="indicator",
            name="op_type",
            field=models.CharField(
                choices=[("sum", "Sum"), ("average", "Average")],
                default="sum",
                max_length=60,
            ),
        ),
    ]
