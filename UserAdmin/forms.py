from django import forms
from TimeSeriesBase.models import Topic, Location,Category


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
                'class' : 'form-control'
            })
            
          
            
        }
    