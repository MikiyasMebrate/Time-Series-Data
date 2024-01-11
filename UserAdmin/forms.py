from django import forms
from TimeSeriesBase.models import Topic,Category,Source,Measurement, Indicator, DataPoint, Month, DataValue


data_point_type = [
    ('yearly', 'Yearly'),
    ('quarterly', 'Quarterly'),
    ('monthly', 'Monthly'),
]


class ImportFileIndicatorForm(forms.Form):
    category = forms.ModelChoiceField(queryset=Category.objects.all(), widget=forms.Select(attrs={
        'class' : 'form-select'
    }))
    file = forms.FileField(widget=forms.ClearableFileInput(attrs={
        'class' : 'form-control'
    }))

class ImportFileForm(forms.Form):
    file = forms.FileField(widget=forms.ClearableFileInput(attrs={
        'class' : 'form-control'
    }))



class ImportFileIndicatorAddValueForm(forms.Form):
    type_of_data = forms.ChoiceField(required=True, choices=data_point_type, widget=forms.Select(attrs={
        'class' : 'form-select'
    }))
    file = forms.FileField(required=True,widget=forms.ClearableFileInput(attrs={
        'class' : 'form-control'
    }))

class ImportFileForm(forms.Form):
    file = forms.FileField(widget=forms.ClearableFileInput(attrs={
        'class' : 'form-control'
    }))

class catagoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ('name_ENG', 'name_AMH', 'topic')

        widgets = {
            'name_ENG': forms.TextInput(attrs={'class': 'form-control'}),
            'name_AMH': forms.TextInput(attrs={'class': 'form-control'}),
            'topic': forms.Select(attrs={'class': 'form-select'}),
        }

    def __init__(self, *args, **kwargs):
        super(catagoryForm, self).__init__(*args, **kwargs)
        # Override the queryset for the topic field
        self.fields['topic'].queryset = Topic.objects.filter(is_deleted=False)

class IndicatorForm(forms.Form):
    data_point_type = [
    ('yearly', 'Yearly'),
    ('quarterly', 'Quarterly'),
    ('monthly', 'Monthly'),
]
    title_ENG = forms.CharField(required=True, widget=forms.TextInput(attrs={
        'class' : 'form-control'
    }))
    title_AMH = forms.CharField(required=True, widget=forms.TextInput(attrs={
        'class' : 'form-control'
    })) 
    for_category = forms.ModelChoiceField(queryset=Category.objects.all(), required=True, widget=forms.Select(attrs={'class': 'form-select','data-placeholder' : "Select Category"}))
    type_of = forms.CharField(required=True, widget=forms.Select(choices=data_point_type,attrs={
        'class' : 'form-select'
    }))



class IndicatorSubForm(forms.Form):
    data_point_type = [
    ('yearly', 'Yearly'),
    ('quarterly', 'Quarterly'),
    ('monthly', 'Monthly'),
]
    title_ENG = forms.CharField(required=True, widget=forms.TextInput(attrs={
        'class' : 'form-control'
    }))
    title_AMH = forms.CharField(required=True, widget=forms.TextInput(attrs={
        'class' : 'form-control'
    })) 



class SubIndicatorForm(forms.Form):
    title_ENG_add = forms.CharField(widget=forms.TextInput(attrs={
        'class' : 'form-control'
    }))
    title_AMH_add = forms.CharField(required=False, widget=forms.TextInput(attrs={
        'class' : 'form-control'
    }))

class SubIndicatorFormDetail(forms.ModelForm):
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
        fields = ('title_ENG', 'title_AMH')

        widgets = {
            'title_ENG': forms.TextInput(attrs={
                'class': 'form-control'
            }),
            'title_AMH': forms.TextInput(attrs={
                'class': 'form-control'
            })
        }

class SourceForm(forms.ModelForm):
    class Meta:
        model = Source
        fields = ('title_ENG', 'title_AMH')

        widgets = {
                'title_ENG': forms.TextInput(attrs={
                    'class': 'form-control'
                }),
                'title_AMH': forms.TextInput(attrs={
                    'class': 'form-control'
                })
        }

class YearForm(forms.ModelForm):
    class Meta:
        model = DataPoint
        fields = ('year_EC',)

        widgets = {
            'year_EC': forms.TextInput(attrs={
                'class': 'form-control'
            })
        }

class MeasurementForm(forms.ModelForm):
    class Meta:

        model = Measurement
        fields = ('Amount_ENG', 'Amount_AMH' )
    
        widgets = {
                'Amount_ENG': forms.TextInput(attrs={
                    'class': 'form-control'
                }),
                'Amount_AMH': forms.TextInput(attrs={
                    'class': 'form-control'
                })
        }

class MeasurementSelectForm(forms.Form):
    measurement_form = forms.CharField(widget=forms.Select(attrs={
        'class' : 'form-control'
    }))

class DataPointForm(forms.ModelForm):
    class Meta:
        model = DataPoint
        fields = '__all__'
        
        widgets = {
            'year_EC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year E.C (Required for Non-Interval) ',
                'min' : '1900',
            }),
            'year_start_EC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year (Not Required, For Interval Year)',
                'min' : '1900',
            }),
            'year_end_EC' : forms.DateInput(attrs={
                'class' : 'form-control',
                'type' : 'number',
                'placeholder':'Please Enter Year (Not Required, For Interval Year)',
                'min' : '1900',
            }),
            'is_interval' : forms.CheckboxInput(attrs={
                'class' : 'form-check'
            })
        }
        
class dataListForm(forms.Form):
    topic = forms.ModelChoiceField(queryset=Topic.objects.all(),required=True,widget=forms.Select(attrs={
        'class' : 'form-control'
    }))
    category = forms.ModelChoiceField(queryset=Category.objects.all(),required=True,widget=forms.Select(attrs={
        'class' : 'form-control'
    }))
    is_interval = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
        'class' : 'form-check'
    }))
    year  = forms.ModelChoiceField(queryset=DataPoint.objects.all(),required=True,widget=forms.Select(attrs={
        'class' : 'form-control'
    }))
    indicator = forms.ModelChoiceField(queryset=Indicator.objects.all(),required=True,widget=forms.Select(attrs={
        'class' : 'form-control'
    }))
    is_actual = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
        'class' : 'form-check'
    }))
    type = forms.CharField(required=True,widget=forms.Select(attrs={
        'class' : 'form-control'
    }))
    value = forms.CharField(required=True, widget=forms.TextInput(attrs={
        'class' : 'form-control'
    }))
    source = forms.ModelChoiceField(required=False,queryset=Source.objects.all(),widget=forms.Select(attrs={
        'class' : 'form-select mt-2'
    }))

#Value
class ValueForm(forms.ModelForm):
    value = forms.FloatField(required=True,widget=forms.Select(attrs={
        'class' : 'form-control'
    }))
    class Meta:
        model = DataValue
        fields = ('value',)
        
        widgets = {
            'value' : forms.TextInput(attrs={
                'class' : 'form-control'
            })
        }

class ValueForm2(forms.Form):
    value2 = forms.FloatField(required=True,widget=forms.Select(attrs={
        'class' : 'form-control'
    }))




