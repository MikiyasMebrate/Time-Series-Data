# Generated by Django 4.2.6 on 2024-01-26 08:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("TimeSeriesBase", "0004_quarter_number"),
    ]

    operations = [
        migrations.AddField(
            model_name="indicator",
            name="public",
            field=models.BooleanField(default=False),
        ),
    ]
