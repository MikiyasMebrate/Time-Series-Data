from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget  # For foreignkey
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin #Admin 
from . import models

# Register your models here.
admin.site.register(models.Topic)
admin.site.register(models.Category)
admin.site.register(models.Indicator_Point)
admin.site.register(models.DataPoint)
admin.site.register(models.Quarter)
admin.site.register(models.Month)
admin.site.register(models.Measurement)
admin.site.register(models.DataValue)
admin.site.register(models.Source)




<<<<<<< HEAD
=======


>>>>>>> d3040dc (minor change on decoraters)

class searchIndicator(admin.ModelAdmin):
    search_fields = ['title_ENG', 'title_AMH']  # Replace field1 and field2 with the fields you want to enable search on

admin.site.register(models.Indicator, searchIndicator)