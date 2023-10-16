from django import forms
from TimeSeriesBase.models import Topic, Location,Category,Source,Measurement, Indicator, DataPoint

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
                'class' : 'select2 form-control',
                'multiple': "multiple",
                'data-placeholder' : "Select a State"
            })        
        }

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
                'class' : 'select2 form-control',
                'data-placeholder' : "Select Categories"
            })
        }

class SubIndicatorForm(forms.ModelForm):
    class Meta:
        model = Indicator
        fields =  ('title_ENG', 'title_AMH')
        
        widgets = {
            'title_ENG' : forms.TextInput(attrs={
                'class' : 'form-control'
            }),
            'title_AMH' : forms.TextInput(attrs={
                'class' : 'form-control'
            }),
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
                'class' : 'select2 form-control',
                'multiple': "multiple",
                'data-placeholder' : "Select a State"
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
    model = DataPoint
    fields = '__all__'

    widgets = {
            'Amount_ENG': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'Amount_AMH': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'Measure': forms.TextInput(attrs={
                'class': 'form-control'
            })
    }


class DataPointForm(forms.ModelForm):
    class Meta:
        model = DataPoint
        fields = '__all__'
        
        widgets = {
            'year_EC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year E.C',
                'min' : '1900',
            }),
            'year_GC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year G.C',
                'min' : '1900',
            }),
            'year_start_EC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year',
                'min' : '1900',
            }),
            'year_end_EC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year',
                'min' : '1900',
            }),
            'year_start_GC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year',
                'min' : '1900',
            }),
            'year_end_GC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year',
                'min' : '1900',
            })
        }