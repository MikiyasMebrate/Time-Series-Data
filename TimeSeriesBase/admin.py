
from django.contrib import admin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget  # For foreignkey
from import_export.fields import Field
from import_export.admin import ImportExportModelAdmin #Admin 
from . import models
from import_export.formats.base_formats import XLS
import tablib
# Register your models here.
#admin.site.register(models.Topic)
#admin.site.register(models.Category)
admin.site.register(models.Indicator_Point)
admin.site.register(models.DataPoint)
admin.site.register(models.Quarter)
admin.site.register(models.Month)
admin.site.register(models.DataValue)
admin.site.register(models.Source)



# Search 
class searchIndicator(admin.ModelAdmin):
    search_fields = ['title_ENG', 'title_AMH']  # Replace field1 and field2 with the fields you want to enable search on

#admin.site.register(models.Indicator, searchIndicator)


# Import Export 

#Topic 
class TopicResource(resources.ModelResource):
    class Meta:
        model = models.Topic
        skip_unchanged = True
        report_skipped = True
        exclude = ( 'id', 'updated', 'created', 'is_deleted')
        import_id_fields = ('title_ENG', 'title_AMH',)
        

    
class TopicAdmin(ImportExportModelAdmin):
    resource_classes = [TopicResource]
    

admin.site.register(models.Topic, TopicAdmin)

def handle_uploaded_Topic_file(file):
    try:
        resource  = TopicResource()
        dataset = tablib.Dataset()

        imported_data = dataset.load(file.read())
        result = resource.import_data(imported_data, dry_run=True)
        if not result.has_errors():
            resource.import_data(dataset, dry_run=False)  # Actually import now
            return True, f"Data imported successfully: {len(dataset)} records imported."
        else:
            return False, f"Error importing data: Please review your Dcoument."
    except Exception as e:
        return False, f"Error importing data: Please review your Document."
    


#Category 
class CategoryResource(resources.ModelResource):
    topic = fields.Field(
        column_name='topic',
        attribute='topic',
        widget=ForeignKeyWidget(models.Topic, field='title_ENG'),
        saves_null_values = True,
        )
        

    def before_import_row(self, row, **kwargs):
            if row.get('topic') is None:
               pass
            else :
               topic_name = row["topic"]
               models.Topic.objects.get_or_create(title_ENG=topic_name, defaults={"title_ENG": topic_name, "title_AMH":topic_name})
    
    class Meta:
        model = models.Category
        skip_unchanged = True
        report_skipped = True
        exclude = ( 'id', 'created_at', 'is_deleted')
        import_id_fields = ('name_ENG', 'name_AMH','topic')

class CategoryAdmin(ImportExportModelAdmin):
    resource_classes = [CategoryResource]

admin.site.register(models.Category, CategoryAdmin)

def handle_uploaded_Category_file(file):
    try:
        resource  = CategoryResource()
        dataset = tablib.Dataset()

        imported_data = dataset.load(file.read())
        result = resource.import_data(imported_data, dry_run=True)
        if not result.has_errors():
            resource.import_data(dataset, dry_run=False)  # Actually import now
            return True, f"Data imported successfully: {len(dataset)} records imported."
        else:
            return False, f"Error importing data: Please review your Dcoument."
    except Exception as e:
        return False, f"Error importing data: Please review your Document."
    


#Indicator 
class IndicatorResource(resources.ModelResource):    
    for_category = fields.Field(
        column_name='for_category',
        attribute='for_category',
        widget=ForeignKeyWidget(models.Category, field='name_ENG'),
        saves_null_values = True,
    )

    parent = fields.Field(
        column_name='parent',
        attribute='parent',
        widget=ForeignKeyWidget(models.Indicator, field='title_ENG'),
        saves_null_values = True,
    )

    measurement = fields.Field(
        column_name='measurement',
        attribute='measurement',
        widget=ForeignKeyWidget(models.Measurement, field='Amount_ENG'),
        saves_null_values = True,
    )
    class Meta:
        model = models.Indicator
        skip_unchanged = True
        report_skipped = True
        exclude = ( 'id', 'created_at', 'is_deleted')
        import_id_fields = ('title_ENG', 'title_AMH','parent','for_category', 'measurement', 'type_of')
        export_order = ('parent','title_ENG', 'title_AMH','for_category', 'measurement', 'type_of')
        
       


class Indicatoradmin(ImportExportModelAdmin):
    resource_classes = [IndicatorResource]


def handle_uploaded_Indicator_file(file):
    try:
        resource  = IndicatorResource()
        dataset = tablib.Dataset()

        imported_data = dataset.load(file.read())
        result = resource.import_data(imported_data, dry_run=True)
        if not result.has_errors():
            resource.import_data(dataset, dry_run=False)  # Actually import now
            return True, f"Data imported successfully: {len(dataset)} records imported."
        else:
            return False, f"Error importing data: Please review your Dcoument."
    except Exception as e:
        return False, f"Error importing data: Please review your Document."
    

admin.site.register(models.Indicator, Indicatoradmin)



#Measurement  
class MeasurementResource(resources.ModelResource):    
    parent = fields.Field(
        column_name='parent',
        attribute='parent',
        widget=ForeignKeyWidget(models.Measurement, field='Amount_ENG'),
        saves_null_values = True,
    )

    class Meta:
        model = models.Measurement
        skip_unchanged = True
        report_skipped = True
        exclude = ( 'id', 'updated', 'created', 'is_deleted')
        import_id_fields = ('Amount_ENG', 'Amount_AMH','parent')
        export_order = ('parent','Amount_ENG', 'Amount_AMH')
        

class MeasurementAdmin(ImportExportModelAdmin):
    resource_classes = [MeasurementResource]


def handle_uploaded_Measurement_file(file):
    try:
        resource  = MeasurementResource()
        dataset = tablib.Dataset()

        imported_data = dataset.load(file.read())
        result = resource.import_data(imported_data, dry_run=True)
        if not result.has_errors():
            resource.import_data(dataset, dry_run=False)  # Actually import now
            return True, f"Data imported successfully: {len(dataset)} records imported."
        else:
            return False, f"Error importing data: Please review your Dcoument."
    except Exception as e:
        return False, f"Error importing data: Please review your Document."
    

admin.site.register(models.Measurement, MeasurementAdmin)