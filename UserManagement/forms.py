from django import forms
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import PasswordChangeForm

class PasswordChangingForm(PasswordChangeForm):
    old_password=forms.CharField(widget= forms.PasswordInput(attrs={
                'class' : 'form-control','placeholder': 'old password'}))
    new_password1=forms.CharField(widget= forms.PasswordInput(attrs={
                'class' : 'form-control','placeholder': 'new password'}))
    new_password2=forms.CharField(widget= forms.PasswordInput(attrs={
                'class' : 'form-control','placeholder': 'confirm password'}))
    class Meta:
        model=CustomUser
        fields=['old_password','new_password1','new_password2']
class CustomUserForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'is_active']  

        widgets = {
            'password': forms.PasswordInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }
         

class CustomUserForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name','last_name', 'photo', 'is_superuser']   

        widgets = {
                'password': forms.PasswordInput(attrs={'class': 'form-control'}),
                'photo' : forms.ClearableFileInput(attrs={
                    'class' : 'form-control'
                })
            } 

class EditProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name','last_name', 'photo']   

        widgets = {
                'password': forms.PasswordInput(attrs={'class': 'form-control'}),
                'photo' : forms.ClearableFileInput(attrs={
                    'class' : 'form-control'
                })
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


class CustomUserCreationForm(forms.Form):
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
    # password1 = forms.CharField( max_length=40, label='Password' ,widget=forms.PasswordInput(attrs={
    #     'class' : 'form-control',
    #     'placeholder' : 'Enter Your Password',
    #     'autocomplete': 'off'
    # }))
    # password2 = forms.CharField( max_length=40, label='Confirm Password', widget=forms.PasswordInput(attrs={
    #     'class' : 'form-control',
    #     'placeholder' : 'Confirm Password',
    #     'autocomplete': 'off'
    # }))
    photo = forms.ImageField(required=False, widget=forms.ClearableFileInput(attrs={
        'class' : 'form-control',
        'placeholder' : 'Add Photo(Optional)',
   
    }))


    is_superuser = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={
        'class' : 'form-check-input'
    }))



class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name']