from django.shortcuts import render,redirect
from UserManagement.models import CustomUser
from django.contrib.auth import update_session_auth_hash
from django. contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.views import generic
from django.contrib.auth.models import User
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.forms import UserCreationForm,UserChangeForm,PasswordChangeForm
from .forms import PasswordChangingForm,UserChangingForm
from django.urls import reverse_lazy
# Create your views here.
def index(request):
    return render(request,"index.html")
def about(request):
    return render(request,"about.html")
def contact(request):
    return render(request,"contact.html")
def profile(request):
    user_releted_data= CustomUser.objects.all()
    context={
        "user":user_releted_data
    }
    return render(request,"profile.html",context)
class PasswordChangeView(SuccessMessageMixin,PasswordChangeView):
    model=User
    form_class=PasswordChangingForm
    success_url=reverse_lazy("change_password")
    success_message = 'password successful updated'

# def setting(request,username):
#     user_releted_data = CustomUser.objects.get(username=username)
    
#     form = UserChangingForm(request.POST or None, instance=user_releted_data)
#     context={
#         "user":user_releted_data,
#         "form":form
#     }
#     return render(request,"setting.html",context)
class UserEditView(generic.UpdateView):
    form_class=UserChangingForm
    template_name='setting.html'
    success_url=reverse_lazy('setting')
    def get_object(self):
        return self.request.user
def login(request):
    return render(request,"login.html")
def data(request):
    return render(request,"data.html")