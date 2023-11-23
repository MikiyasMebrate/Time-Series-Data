from django.db import models
from UserManagement.models import CustomUser
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver


class Topic(models.Model):
    title_ENG = models.CharField(max_length=50)
    title_AMH = models.CharField(max_length=50)
    user = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)
    updated =  models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title_ENG
    

class Category(models.Model):
    name_ENG = models.CharField(max_length=50)
    name_AMH = models.CharField(max_length=50)
    topic = models.ManyToManyField(Topic)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name_ENG

class Indicator(models.Model):
    title_ENG = models.CharField(max_length=100) 
    title_AMH = models.CharField(max_length=100 , null=True, blank=True)
    parent = models.ForeignKey('self', related_name='children', on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    for_category = models.ForeignKey(Category, blank=True, null=True, on_delete=models.SET_NULL)
    is_deleted = models.BooleanField(default = False)
    measurement = models.ForeignKey('Measurement', blank=True, null=True, on_delete=models.CASCADE)
      

    def str(self):
        return self.get_full_path()

    def get_full_path(self):
        full_path = [self.title_ENG]
        k = self.parent
        while k is not None:
            full_path.append(k.title_ENG)
            k = k.parent
        return ' -> '.join(full_path[::-1])

    def __str__(self):
        return self.title_ENG





data_point_type = [
    ('quarterly', 'Quarterly'),
    ('monthly', 'monthly'),
]

class Indicator_Point(models.Model):
    is_actual = models.BooleanField()
    for_datapoint = models.ForeignKey("DataPoint",on_delete=models.CASCADE)
    for_indicator = models.ForeignKey("Indicator",on_delete=models.CASCADE)
    for_measurement = models.ManyToManyField('Measurement', blank=True)
    type_of = models.CharField(choices=data_point_type ,max_length=60, null=True, blank=True)
    
    def __str__(self):
         return self.for_indicator.title_ENG + " " + self.for_datapoint.year_EC + "E.C" +" " + self.type_of


class DataPoint(models.Model):
    year_EC = models.CharField(max_length=50, null=True, blank=True)
    year_GC = models.CharField(max_length=50, null=True, blank=True)
    is_interval = models.BooleanField(default=False)
    year_start_EC = models.CharField(max_length=50, null=True, blank=True)
    year_start_GC = models.CharField(max_length=50, null=True, blank=True)
    year_end_EC = models.CharField(max_length=50, null=True, blank=True)
    year_end_GC = models.CharField(max_length=50, null=True, blank=True)
    months = models.ManyToManyField('Month', blank=True)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    is_deleted =models.BooleanField(default=True)
    
    
    class Meta:
        ordering = ['-year_EC'] #Oldest First
        
        
    def __str__(self):
        if self.is_interval:
            return self.year_start_EC + " - " + self.year_end_EC + "E.C"
        else:
            return self.year_EC+" "+"E.C"

class Quarter(models.Model):
    quarter = models.CharField(max_length=50)
    year = models.ForeignKey(DataPoint, on_delete=models.CASCADE, blank=True, null=True)
    
    def __str__(self):
        return self.quarter
    

class Month(models.Model):
    month_ENG = models.CharField(max_length=50)
    month_AMH = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.month_ENG
    
class Measurement(models.Model):
    Amount_ENG = models.CharField(max_length=50)
    Amount_AMH = models.CharField(max_length=50, null=True, blank=True)
    parent = models.ForeignKey('self', related_name='children', on_delete=models.CASCADE, blank=True, null=True)
    updated =  models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
    def str(self):
        return self.get_full_path()

    def get_full_path(self):
        full_path = [self.Amount_ENG]
        k = self.parent
        while k is not None:
            full_path.append(k.Amount_ENG)
            k = k.parent
        return ' -> '.join(full_path[::-1])

    def __str__(self):
        return self.Amount_ENG
    
class DataValue(models.Model):
    value = models.CharField(max_length=50, blank=True ,null=True)
    for_quarter = models.ForeignKey("Quarter", on_delete=models.SET_NULL, blank=True ,null=True)
    for_month = models.ForeignKey("Month", on_delete=models.SET_NULL, blank=True ,null=True)
    for_datapoint = models.ForeignKey("DataPoint", on_delete=models.SET_NULL, blank=True, null=True)
    for_source = models.ForeignKey("Source",on_delete=models.SET_NULL  ,blank=True, null=True,)
    for_indicator = models.ForeignKey(Indicator, null=True, blank=True, on_delete=models.SET_NULL)
    is_deleted = models.BooleanField(default = False)

    def calculate_parent_value(self):
        try: 
            main_parent = self.for_indicator.parent
            try: parent_data_value = DataValue.objects.get(for_indicator = main_parent, for_datapoint = self.for_datapoint)
            except:parent_data_value = None
            child_indicators = Indicator.objects.filter(parent = main_parent, is_deleted = False)
           
            sum = 0
            for child in child_indicators:
                try: 
                    child_data_value = DataValue.objects.get(for_indicator = child, for_datapoint = self.for_datapoint)
                    if(child_data_value.is_deleted == False):
                        sum  = sum + int(child_data_value.value)
                    else:
                        None
                except: 
                    None
                
            if parent_data_value is None:
                parent_data = DataValue()
                parent_data.value = sum
                parent_data.for_indicator = main_parent
                parent_data.for_datapoint = self.for_datapoint
                parent_data.save()
            else: 
                parent_data_value.value = sum
                try: parent_data_value.save()
                except: None
        except:
            None
    
@receiver(post_save, sender=DataValue)
def call_my_function(sender, instance, created, **kwargs):
    if created: 
        instance.calculate_parent_value()
    else:  
        instance.calculate_parent_value()

    
class Source(models.Model):
    title_ENG = models.CharField(max_length=50)
    title_AMH = models.CharField(max_length=50)
    updated =  models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title_ENG
    

class Location(models.Model):
    name_ENG = models.CharField(max_length=50) 
    name_AMH = models.CharField(max_length=50) 
    updated =  models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created','-updated']
    
    def __str__(self):
        return self.name_ENG