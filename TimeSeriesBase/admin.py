
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
        report_skipped = True
        skip_unchanged = True
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
        new_data_set = []
        for row in imported_data.dict:
            new_data_set.append((row['name_ENG'],  row['name_AMH'],row['topic']))
        dataset = tablib.Dataset(*new_data_set, headers=['name_ENG', 'name_AMH', 'topic'])
        result = resource.import_data(dataset, dry_run=True)
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
        widget=ForeignKeyWidget(models.Indicator, field='id'),
        saves_null_values = True,
    )

    measurement = fields.Field(
        column_name='measurement',
        attribute='measurement',
        widget=ForeignKeyWidget(models.Measurement, field='Amount_ENG'),
        saves_null_values = True,
    )
    def after_import_row(self, row, row_result, row_number=None, **kwargs):
        return row_result.object_id

    class Meta:
        model = models.Indicator
        report_skipped = True
        skip_unchanged = True
        exclude = ( 'created_at', 'is_deleted')
        fields = ('id', 'title_ENG', 'title_AMH','for_category', 'measurement', 'type_of')
        import_id_fields = ('parent','title_ENG', 'title_AMH','for_category', 'measurement', 'type_of')
        export_order = ('parent','title_ENG', 'title_AMH','for_category', 'measurement', 'type_of')
    

    

class Indicatoradmin(ImportExportModelAdmin):
    resource_classes = [IndicatorResource]


def handle_uploaded_Indicator_file(file, category):
    try:
        def filterParent(item):
            if item['parent'] == None:
                return item
            

        def filterChild(itemParent, itemChild):
           if itemChild['parent'] == itemParent:
               return itemChild
           

  
        resource  = IndicatorResource()
        dataset = tablib.Dataset()


        imported_data = dataset.load(file.read())
        count_successfully_imported = 0
        
            
        indicator_list = []
        for row in imported_data.dict:
            if row['parent'] == None and row['title_ENG'] != None :
                indicator_list.append({'parent':row['parent'], 'title_ENG':row['title_ENG'],  'title_AMH':row['title_AMH'],'for_category':category.name_ENG,'measurement': row['measurement'],'type_of':row['type_of']})
            elif row['parent'] != None:
                indicator_list.append({'parent':row['parent'], 'title_ENG':row['title_ENG'],  'title_AMH':row['title_AMH'],'for_category':None,'measurement': None,'type_of':None})
        
        parentIndicator = list(filter(lambda parent_item: filterParent(parent_item), indicator_list ))

        #Child 
        def filterChildIndicator(parent_id, parent_name, main_parent_name):
            childIndicator = filter(lambda child_item : filterChild(parent_name, child_item), indicator_list )
            childIndicator =  list(childIndicator)

            if len(childIndicator) != 0:
                for child in childIndicator:
                    test = models.Indicator.objects.filter(title_ENG = child['title_ENG'], parent = parent_id )
                                       
                    data = (parent_id, f'{child['title_ENG']} ({main_parent_name})' ,child['title_AMH'],None, None,None)
                    child_dataset = tablib.Dataset(data, headers=['parent', 'title_ENG', 'title_AMH', 'for_category', 'measurement', 'type_of'])
                    result = resource.import_data(child_dataset, dry_run=True)
                    
                    if not result.has_errors():
                       resource.import_data(child_dataset, dry_run=False)  # Actually import now             
                       parent_Child_id  = models.Indicator.objects.latest('id').id
                       filterChildIndicator(parent_Child_id, child['title_ENG'], main_parent_name)
                    else:
                         print('has error')
                    

        #Parent 
        for parent in parentIndicator:
            data = (parent['parent'], f'{parent['title_ENG']} ({category.name_ENG})',  parent['title_AMH'],category.name_ENG, parent['measurement'],parent['type_of'])
            parent_dataset = tablib.Dataset(data, headers=['parent', 'title_ENG', 'title_AMH', 'for_category', 'measurement', 'type_of'])
            result = resource.import_data(parent_dataset, dry_run=True)
            #Check if the indicator exist     
            test = models.Indicator.objects.filter(title_ENG = parent['title_ENG'], for_category = category.id, parent = None).first()
            if test != None:
                
                filterChildIndicator(test.id, parent['title_ENG'])
            elif not result.has_errors():
               resource.import_data(parent_dataset, dry_run=False)  # Actually import now  
              
               count_successfully_imported = count_successfully_imported + 1 
               parent_id  = models.Indicator.objects.latest('id').id
               filterChildIndicator(parent_id, parent['title_ENG'], parent['title_ENG'])
        return True, f"Data imported successfully: {count_successfully_imported} records imported."

    except Exception as e:
        print(f"An exception occurred: {e}")
        return False, f"Error importing data: Please review your Document. {e}"
    

    

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