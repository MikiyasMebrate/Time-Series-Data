# Generated by Django 4.2.6 on 2023-10-09 12:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Catagory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_ENG', models.CharField(max_length=50)),
                ('name_AMH', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='DataPoint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year_EC', models.CharField(max_length=50)),
                ('year_GC', models.CharField(max_length=50)),
                ('year_start_EC', models.CharField(max_length=50)),
                ('year_start_GC', models.CharField(max_length=50)),
                ('year_end_EC', models.CharField(max_length=50)),
                ('year_end_GC', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Indicator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title_ENG', models.CharField(max_length=100)),
                ('title_AMH', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('for_catagory', models.ManyToManyField(to='TimeSeriesBase.catagory')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='TimeSeriesBase.indicator')),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_ENG', models.CharField(max_length=50)),
                ('name_AMH', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Month',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month_ENG', models.CharField(max_length=50)),
                ('month_AMH', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title_ENG', models.CharField(max_length=50)),
                ('title_AMH', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title_ENG', models.CharField(max_length=50)),
                ('title_AMH', models.CharField(max_length=50)),
                ('for_location', models.ManyToManyField(to='TimeSeriesBase.location')),
            ],
        ),
        migrations.CreateModel(
            name='Quarter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quarter', models.CharField(max_length=50)),
                ('year', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='TimeSeriesBase.datapoint')),
            ],
        ),
        migrations.CreateModel(
            name='Measurement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Amount_ENG', models.CharField(max_length=50)),
                ('Amount_AMH', models.CharField(max_length=50)),
                ('Measure', models.CharField(max_length=50, null=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='TimeSeriesBase.measurement')),
            ],
        ),
        migrations.CreateModel(
            name='Indicator_Point',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_actual', models.BooleanField()),
                ('type_of', models.CharField(blank=True, choices=[('quarterly', 'Quarterly'), ('monthly', 'monthly')], max_length=60, null=True)),
                ('for_datapoint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='TimeSeriesBase.datapoint')),
                ('for_indicator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='TimeSeriesBase.indicator')),
            ],
        ),
        migrations.CreateModel(
            name='DataValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=50)),
                ('for_datapoint', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='TimeSeriesBase.datapoint')),
                ('for_measurement', models.ManyToManyField(to='TimeSeriesBase.measurement')),
                ('for_month', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='TimeSeriesBase.month')),
                ('for_quarter', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='TimeSeriesBase.quarter')),
                ('for_source', models.ManyToManyField(to='TimeSeriesBase.source')),
            ],
        ),
        migrations.AddField(
            model_name='catagory',
            name='topic',
            field=models.ManyToManyField(to='TimeSeriesBase.topic'),
        ),
    ]
