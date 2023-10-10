from django import forms
from TimeSeriesBase.models import Topic, Location, Indicator


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
    