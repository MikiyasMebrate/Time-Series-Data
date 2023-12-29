# Generated by Django 4.2.6 on 2023-12-09 04:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0016_book_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='user',
        ),
        migrations.DeleteModel(
            name='Location',
        ),
        migrations.AlterField(
            model_name='datavalue',
            name='for_datapoint',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='datavalue_set', to='TimeSeriesBase.datapoint'),
        ),
        migrations.DeleteModel(
            name='Book',
        ),
    ]