
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
admin.site.register(models.Measurement)
admin.site.register(models.DataValue)
admin.site.register(models.Source)



# Search 
class searchIndicator(admin.ModelAdmin):
    search_fields = ['title_ENG', 'title_AMH']  # Replace field1 and field2 with the fields you want to enable search on

admin.site.register(models.Indicator, searchIndicator)


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
        return False, f"Error importing data: {str(e)}"
    


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
               models.Topic.objects.get_or_create(title_ENG=topic_name, defaults={"title_ENG": topic_name, "title_ENG":topic_name})
    
    class Meta:
        model = models.Category
    



class CategoryAdmin(ImportExportModelAdmin):
    resource_classes = [CategoryResource]

admin.site.register(models.Category, CategoryAdmin)
