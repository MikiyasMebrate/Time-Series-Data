from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class Login_Form(forms.Form):
    email = forms.EmailField(label='Email', widget=forms.EmailInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Enter Your Email'
    }))
    password = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Enter Your Password'
    }))