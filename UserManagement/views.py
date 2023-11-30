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
from django.contrib.auth.decorators import login_required

#Session
@login_required(login_url='login')
def users_list(request):

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_staff = True
            user.save()


            messages.success(request, 'Your Account has been Successfully Created!')
            return redirect('user-admin-user-list')
        else:
            messages.error(request, 'Please Try Again!')

    # If it's a GET request or the form is not valid, render the form and user list
    form = CustomUserCreationForm()
    total_users_count = CustomUser.objects.count()
    active_users_count = CustomUser.objects.filter(is_active=True).count()
    inactive_users_count = total_users_count - active_users_count
    users = CustomUser.objects.all()

    context = {
        'form': form,
        'users': users,
        'total_users_count': total_users_count,
        'active_users_count': active_users_count,
        'inactive_users_count': inactive_users_count,
    }

    return render(request, 'user-admin/users_list.html', context)
        


@login_required(login_url='login')
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


@login_required(login_url='login')
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

@login_required(login_url='login')
def user_registration_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            
            form = CustomUserCreationForm()   
    else:
        form = CustomUserCreationForm()

    return render(request, 'user-admin/profile.html', {'form': form})

@login_required(login_url='login')
def update_user(request, pk):
    user = get_object_or_404(CustomUser, pk=pk)
    form = EditProfileForm(request.POST or None, request.FILES or None,instance=user)
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            form = EditProfileForm()
            messages.success(request, 'Successfully Updated!')
        else:
            messages.error(request, 'Please tye again!')         
    return render(request, 'user-admin/profile.html', {'form': form, 'user': user})


@login_required(login_url='login')
def activate_deactivate_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    previous_page = request.META.get('HTTP_REFERER')
    
    if request.method == 'POST':
        user.is_active = not user.is_active  # Toggle the is_active status
        user.save()
        messages.success(request, f"User '{user.first_name} {user.last_name}' has been {'Activated ' if user.is_active else 'Deactivated'}!")
        return HttpResponseRedirect(previous_page)

    return render(request, 'user-admin/users_list.html', {'user': user})



# def delete_user(request, user_id):
#     user = get_object_or_404(CustomUser, id=user_id)
#     previous_page = request.META.get('HTTP_REFERER')
#     if request.method == 'POST':
#         user.delete()
#         messages.success(request, "Successfully Deleted!")
#         return HttpResponseRedirect(previous_page)
    
    
   











 