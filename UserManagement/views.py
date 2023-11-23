from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, HttpResponse, redirect
from django.urls import reverse
from django.contrib import messages
from TimeSeriesBase.models import *
from .forms import *
from django.shortcuts import render, redirect
from .forms import CustomUserForm,UserUpdateForm
from .models import CustomUser


def update_user(request, pk):
    user = get_object_or_404(CustomUser, pk=pk)

    if request.method == 'POST':
        form = CustomUserForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
             
    else:
        form = CustomUserForm(instance=user)

    
    return render(request, 'user-admin/profile.html', {'form': form, 'user': user})


def user_registration_view(request):
    if request.method == 'POST':
        form = CustomUserForm(request.POST)
        if form.is_valid():
            form.save()
            
            form = CustomUserForm()   
    else:
        form = CustomUserForm()

    return render(request, 'user-admin/profile.html', {'form': form})


def users_list(request):
    form = CustomUserForm()

    if request.method == 'POST':
        form = CustomUserForm(request.POST)
        if form.is_valid():
            form.save()
            # return redirect('users_list')   
    
    total_users_count = CustomUser.objects.count()
    active_users_count = CustomUser.objects.filter(is_active=True).count()
    inactive_users_count = total_users_count - active_users_count
    users = CustomUser.objects.all()

    return render(request, 'user-admin/users_list.html', {
        'form': form,
        'users': users,
        'total_users_count': total_users_count,
        'active_users_count': active_users_count,
        'inactive_users_count': inactive_users_count,
    })


# edit and delete
def edit_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    if request.method == 'POST':
        form = CustomUserForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            # return redirect('user_list')
    else:
        form = CustomUserForm(instance=user)

    return render(request, 'user-admin/users_list.html', {
        'form': form,
        'user': user,
    })


def delete_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    if request.method == 'POST':
        user.delete()
        # return redirect('user_list')

    return render(request, 'user-admin/users_list.html', {'user': user})













 