from django import forms
from TimeSeriesBase.models import Topic, Location


class LocationForm(forms.ModelForm):
    class Meta:
        model = Location
        fields =  ('name_ENG', 'name_AMH')
        
        
    