from django import forms
from django.contrib.auth.forms import PasswordChangeForm,UserChangeForm
from django.contrib.auth.models import User  
class PasswordChangingForm(PasswordChangeForm):
    old_password=forms.CharField(widget= forms.PasswordInput(attrs={
                'class' : 'form-control','placeholder': 'old password'}))
    new_password1=forms.CharField(widget= forms.PasswordInput(attrs={
                'class' : 'form-control','placeholder': 'new password'}))
    new_password2=forms.CharField(widget= forms.PasswordInput(attrs={
                'class' : 'form-control','placeholder': 'confirm password'}))
    class Meta:
        model=User
        fields=['old_password','new_password1','new_password2']
class UserChangingForm(UserChangeForm):
    username=forms.CharField(widget= forms.TextInput(attrs={
                'class' : 'form-control','placeholder': 'username'}))
    last_name=forms.CharField(widget= forms.TextInput(attrs={
                'class' : 'form-control','placeholder': 'last_name'}))
    first_name=forms.CharField(widget= forms.TextInput(attrs={
                'class' : 'form-control','placeholder': 'first_name'}))
    email=forms.CharField(widget= forms.EmailInput(attrs={
                'class' : 'form-control','placeholder': 'email'}))
    class Meta:
        model=User
        fields= ['username','last_name','first_name','email']    
    