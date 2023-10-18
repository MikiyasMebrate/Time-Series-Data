from django.shortcuts import render,redirect
from UserManagement.models import CustomUser
from django. contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.views import generic
from django.views.generic.detail import DetailView
from django.contrib.auth.views import PasswordChangeView
from .forms import PasswordChangingForm,UserChangingForm
from django.urls import reverse_lazy
# Create your views here.
def index(request):
    return render(request,"index.html")
def about(request):
    return render(request,"about.html")
def contact(request):
    return render(request,"contact.html")

class MyView(DetailView):
    Model = CustomUser
    def get_object(self):
        return self.request.user

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
    # def post(self,request):
    #     post_data=request.POST or None
    #     file_data=request.FILES or None
    #     profile_form=profilepcform(post_data,file_data,instance=request.user.CustomUser)
    #     if profile_form.is_valid():
    #         profile_form.save()
            
            
def login(request):
    return render(request,"login.html")
def data(request):
    return render(request,"data.html")