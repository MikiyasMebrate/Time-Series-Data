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
            
            
def login_view(request):
    form = Login_Form(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, email=email,password=password)
        if (user is not None and user.is_superuser) or (user is not None and user.is_admin):
            login(request, user)
            return redirect('admin')
        elif user is not None and user.is_user:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Invalid Password or Email')
    context = {
        'form' : form
    }
    return render(request,"login.html",context)

def data(request):
    return render(request,"data.html")