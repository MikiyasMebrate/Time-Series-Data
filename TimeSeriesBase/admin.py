from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Location)
admin.site.register(models.Topic)
admin.site.register(models.Category)
admin.site.register(models.Indicator_Point)
admin.site.register(models.DataPoint)
admin.site.register(models.Quarter)
admin.site.register(models.Month)
admin.site.register(models.Measurement)
admin.site.register(models.DataValue)
admin.site.register(models.Source)


class searchIndicator(admin.ModelAdmin):
    search_fields = ['title_ENG', 'title_AMH']  # Replace field1 and field2 with the fields you want to enable search on

admin.site.register(models.Indicator, searchIndicator)