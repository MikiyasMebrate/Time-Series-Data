# Generated by Django 4.2.6 on 2023-11-27 06:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0013_category_created_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title_ENG', models.CharField(max_length=50)),
                ('title_AMH', models.CharField(max_length=50)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='source',
            name='is_deleted',
        ),
    ]