# Generated by Django 4.2.13 on 2024-05-28 06:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserManagement', '0004_customuser_last_reset_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_dashboard',
            field=models.BooleanField(default=False),
        ),
    ]
