from django.shortcuts import render,redirect
from UserManagement.models import CustomUser
from django. contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.views import generic
from django.views.generic.detail import DetailView
from django.contrib.auth.views import PasswordChangeView
from .forms import Login_Form, PasswordChangingForm,UserChangingForm
from django.urls import reverse_lazy
from django.contrib.auth import login,authenticate,logout
from django.contrib.auth.decorators import login_required
# Create your views here.
from UserManagement.decorators import *
from UserManagement.forms import *
@login_required(login_url='login')
# @admin_only
def index(request):
    return render(request,"index.html")
@login_required(login_url='login')
# @admin_only
def about(request):
    return render(request,"about.html")
@login_required(login_url='login')
# @admin_only
def contact(request):
    return render(request,"contact.html")

# class MyView(DetailView):
#     Model = CustomUser
#     def get_object(self):
#         return self.request.user

class PasswordChangeView(SuccessMessageMixin,PasswordChangeView):
    model=CustomUser
    form_class=PasswordChangingForm
    success_url=reverse_lazy("change_password")
    success_message = 'password successful updated'
  
class UserEditView(generic.UpdateView):
    form_class=UserChangingForm
    template_name='setting.html'
    success_url=reverse_lazy('setting')
    def get_object(self):
        return self.request.user

@login_required(login_url='login')
def profile_view(request):
    users = CustomUser.objects.all()
    users.is_staff = True

    context = {
        
        'users': users,
      
    }
    return render(request,"profile.html",context)
# @admin_only
def data(request):
    return render(request,"data.html")