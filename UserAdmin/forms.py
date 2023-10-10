from django import forms
<<<<<<< HEAD
from TimeSeriesBase.models import Topic, Location,Category
=======
from TimeSeriesBase.models import Topic, Location,Source,Measurement, Indicator
>>>>>>> e701f70954d331ce90e9eae06cb9e489a31b8270


class LocationForm(forms.ModelForm):
    class Meta:
        model = Location
        fields =  ('name_ENG', 'name_AMH')
        
        widgets = {
            'name_ENG' : forms.TextInput(attrs={
                'class' : 'form-control'
            }),
            'name_AMH' : forms.TextInput(attrs={
                'class' : 'form-control'
            })
        }
<<<<<<< HEAD
class catagoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields =  ('name_ENG', 'name_AMH','topic')
        
        widgets = {
            'name_ENG' : forms.TextInput(attrs={
                'class' : 'form-control'
            }),
            'name_AMH' : forms.TextInput(attrs={
                'class' : 'form-control'
            }),
              'topic' : forms.SelectMultiple(attrs={
                'class' : 'form-control'
            })
            
          
            
        }
    
=======
        
class IndicatorForm(forms.ModelForm):
    class Meta:
        model = Indicator
        fields =  ('title_ENG', 'title_AMH', 'for_category')
        
        widgets = {
            'title_ENG' : forms.TextInput(attrs={
                'class' : 'form-control'
            }),
            'title_AMH' : forms.TextInput(attrs={
                'class' : 'form-control'
            }),
            'for_category' : forms.SelectMultiple(attrs={
                'class' : 'form-control'
            })
        }
    

class TopicForm(forms.ModelForm):
    class Meta:
        model = Topic
        fields = '__all__'

        widgets = {
            'title_ENG': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'title_AMH': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'for_location': forms.SelectMultiple(attrs={
                'class': 'form-control'
            })
        }

class SourceForm(forms.ModelForm):
    class Meta:
        model = Source
        fields = '__all__'

        widgets = {
                'title_ENG': forms.TextInput(attrs={
                    'class': 'form-control'
                }),
                'title_AMH': forms.TextInput(attrs={
                    'class': 'form-control'
                })
        }

class MeasurmentForm(forms.ModelForm):
    model = Measurement
    fields = '__all__'

    widgets = {
            'Amount_ENG': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'Amount_AMH': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'parent': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'Measure': forms.TextInput(attrs={
                'class': 'form-control'
            })
    }
>>>>>>> e701f70954d331ce90e9eae06cb9e489a31b8270
