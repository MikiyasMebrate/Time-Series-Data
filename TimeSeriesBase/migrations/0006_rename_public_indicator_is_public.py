# Generated by Django 4.2.6 on 2024-01-26 08:53

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("TimeSeriesBase", "0005_indicator_public"),
    ]

    operations = [
        migrations.RenameField(
            model_name="indicator",
            old_name="public",
            new_name="is_public",
        ),
    ]