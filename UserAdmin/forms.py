from django import forms
<<<<<<< HEAD
from TimeSeriesBase.models import Topic, Location, Indicator
=======
from TimeSeriesBase.models import Topic, Location,Source,Measurement
>>>>>>> 42655ba7b08806e34f84d014d3ead771e771fe47


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
    
=======

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
>>>>>>> 42655ba7b08806e34f84d014d3ead771e771fe47
