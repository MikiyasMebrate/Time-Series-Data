# Generated by Django 4.2.6 on 2024-01-08 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TimeSeriesBase', '0029_alter_category_name_amh_alter_category_name_eng_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='name_AMH',
            field=models.CharField(max_length=300, unique=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='name_ENG',
            field=models.CharField(max_length=300, unique=True),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='title_AMH',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='title_ENG',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='topic',
            name='title_AMH',
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='topic',
            name='title_ENG',
            field=models.CharField(max_length=300, unique=True),
        ),
    ]
