# Generated by Django 4.2.6 on 2024-01-26 09:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("TimeSeriesBase", "0006_rename_public_indicator_is_public"),
    ]

    operations = [
        migrations.AlterField(
            model_name="indicator",
            name="is_public",
            field=models.BooleanField(default=True),
        ),
    ]
