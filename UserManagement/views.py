from django.http import JsonResponse,HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, HttpResponse, redirect
from django.urls import reverse
from django.contrib import messages
from TimeSeriesBase.models import *
from .forms import *
from django.shortcuts import render, redirect
# from .forms import CustomUserForm,UserUpdateForm
from django.contrib.auth.models import Group
from .models import CustomUser
from django.contrib.auth import login,authenticate,logout
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.forms import AuthenticationForm
from .decorators import unauthenticated_user
#Session
def users_list(request):
    users = CustomUser.objects.all()
    form = CustomUserCreationForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = form.save(commit=False)
            user.is_staff = True
            user.save()
            group=Group.objects.get(name='otherusers')
            user.groups.add(group)
            messages.success(request, 'Your Account has been Successfully Created! Please Login')
            return redirect('user-admin-user-list')   
    total_users_count = CustomUser.objects.count()
    active_users_count = CustomUser.objects.filter(is_active=True).count()
    inactive_users_count = total_users_count - active_users_count
    users = CustomUser.objects.all()
    context = {
        'form' : form,
        'users':users,
        'total_users_count': total_users_count,
        'active_users_count': active_users_count,
        'inactive_users_count': inactive_users_count, 
    }

    return render(request, 'user-admin/users_list.html', context)
        
def logout_view(request):
    logout(request)
    return redirect('login')

def login_view(request):
    if request.method == 'POST':
        form = Login_Form(request.POST)
        if form.is_valid():
            # username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request,email=email,password=password)

            if user is not None and user.is_superuser:
                login(request, user)
                return redirect('user-admin-index')
            elif user is not None and user.is_staff:
                login(request, user)
                return redirect('index')
            else:
                messages.error(request, 'Invalid Password or Email')
    else:
        form = Login_Form()
    return render(request, 'login.html', {'form': form})



def edit_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)

    if request.method == 'POST':
        form = CustomUserForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, "User updated successfully!")
            return redirect('user-admin-user-list')  # Change 'user-admin-user-list' to the appropriate URL name or path
    else:
        form = CustomUserForm(instance=user)

    return render(request, 'user-admin/edit_user.html', {
        'form': form,
        'user': user,
    })

def user_registration_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            
            form = CustomUserCreationForm()   
    else:
        form = CustomUserCreationForm()

    return render(request, 'user-admin/profile.html', {'form': form})

def update_user(request, pk):
    user = get_object_or_404(CustomUser, pk=pk)
    if request.method == 'POST':
        form = CustomUserForm(request.POST, instance=user)
        if form.is_valid():
            form.save()         
    else:
        form = CustomUserForm(instance=user)
    return render(request, 'user-admin/profile.html', {'form': form, 'user': user})

def delete_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    previous_page = request.META.get('HTTP_REFERER')
    if request.method == 'POST':
        user.delete()
        messages.success(request, "Successfully Deleted!")
        return HttpResponseRedirect(previous_page)
    
    
   











 