from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Location)
admin.site.register(models.Topic)
admin.site.register(models.Category)
admin.site.register(models.Indicator)
admin.site.register(models.Indicator_Point)
admin.site.register(models.DataPoint)
admin.site.register(models.Quarter)
admin.site.register(models.Month)
admin.site.register(models.Measurement)
admin.site.register(models.DataValue)
admin.site.register(models.Source)
