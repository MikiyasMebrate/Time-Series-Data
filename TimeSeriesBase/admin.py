from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget  # For foreignkey
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin #Admin 
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




class BookResource(resources.ModelResource):
    user = fields.Field(column_name='user', attribute='user', widget=ForeignKeyWidget(models.CustomUser, field='username'))  #Allow u to reference model
    class Meta:
        model = models.Book
        fields = ('title_ENG', 'title_AMH', 'user__username' )
        export_order = ('title_ENG', 'title_AMH',)


class BookResourceWithStoreInstance(resources.ModelResource):
        user = fields.Field(column_name='user', attribute='user', widget=ForeignKeyWidget(models.CustomUser, field='username')) 
        class Meta:
            #fields = ('id','title_ENG', 'title_AMH', 'user__username' )
            model = models.Book
            store_instance = True
            #Handle Duplicated Data
            skip_unchanged = True
            report_skipped = False
            unique_together = ('title_ENG', 'title_AMH', 'user')


class BookAdmin(ImportExportModelAdmin):
    resource_classes = [BookResource]

admin.site.register(models.Book, BookAdmin)


class searchIndicator(admin.ModelAdmin):
    search_fields = ['title_ENG', 'title_AMH']  # Replace field1 and field2 with the fields you want to enable search on

admin.site.register(models.Indicator, searchIndicator)