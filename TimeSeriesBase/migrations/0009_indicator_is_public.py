# Generated by Django 4.2.6 on 2024-01-26 09:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("TimeSeriesBase", "0008_remove_indicator_is_public"),
    ]

    operations = [
        migrations.AddField(
            model_name="indicator",
            name="is_public",
            field=models.BooleanField(default=True),
        ),
    ]