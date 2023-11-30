from django import forms
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm

class CustomUserForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'is_active','photo']     

    widgets = {
            'password': forms.PasswordInput(attrs={'class': 'form-control'}),
             
        }    
class Login_Form(forms.Form):
    # username = forms.CharField(max_length=30, widget=forms.TextInput(attrs={
    #     'class' : 'form-control',
    #     'placeholder' : 'Enter your Username',
    #     'autocomplete': 'off' 
    # }))
    email = forms.EmailField(label='Email', widget=forms.EmailInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Enter Your Email'
    }))
    password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Enter Your Password'
    }))
    class Meta:
        fields = ['email', 'password','username']


class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Your First Name'
    }))
    last_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Your Last Name'
    }))
    username = forms.CharField(max_length=30, widget=forms.TextInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Enter your Username',
        'autocomplete': 'off' 
    }))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Enter your Email',
        'autocomplete': 'off'
    }))
    password1 = forms.CharField( max_length=40, label='Password' ,widget=forms.PasswordInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Enter Your Password',
        'autocomplete': 'off'
    }))
    password2 = forms.CharField( max_length=40, label='Confirm Password', widget=forms.PasswordInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Confirm Password',
        'autocomplete': 'off'
    }))
    photo = forms.ImageField(required=False, widget=forms.ClearableFileInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Add Photo(Optional)',
   
    }))

    # is_superuser = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
    #     'class' : 'form-check-input'
    # }))

    is_admin = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
        'class' : 'form-check-input'
    }))

    is_user = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
        'class' : 'form-check-input'
    }))

    class Meta:
        model = CustomUser
        fields = ('first_name','last_name', 'username' , 'is_user', 'is_admin', 'email','password1', 'password2', 'photo')


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name']