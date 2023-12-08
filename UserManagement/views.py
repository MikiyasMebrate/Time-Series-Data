from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from TimeSeriesBase.models import *
from .forms import *
from django.shortcuts import render, redirect
from .models import CustomUser
from django.contrib.auth import login,authenticate,logout
from  .decorators import admin_user_required, staff_user_required
from django.contrib.auth.decorators import login_required
import random
import string
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash

def generate_password(length):
    characters = string.ascii_letters + string.digits 
    password = ''.join(random.choice(characters) for _ in range(length))
    return password


#Session
@login_required(login_url='login')
@admin_user_required
def users_list(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            try: 
                 username = form.cleaned_data['username']
                 first_name = form.cleaned_data['first_name']
                 last_name = form.cleaned_data['last_name']
                 email = form.cleaned_data['email']
                 is_admin = form.cleaned_data['is_superuser']
                 
                 auto_password = generate_password(10)
                 user_obj = CustomUser.objects.create_user(email=email, first_name=first_name, is_superuser = is_admin, last_name = last_name, is_active= True, is_staff=True,  username=username, password=auto_password)
     
     
     
                 subject, from_email, to = "Account Creation", "mikiyasmebrate2656@gmail.com", f"{email}"
                 text_content = "Account Created Successfully"
                 html_content = f''' <p> Dear {first_name} {last_name}, </p>
                 <p> We are delighted to inform you that your account has been successfully created. Welcome to our platform!</p>
                 <p>Below are your account details:</p>
                 <p>Email: {email}</p>
                 <p>Password: {auto_password}</p>
                 <p>Please keep this information secure and do not share it with anyone.</p>
                 <p>Thank you for joining us! We look forward to providing you with a great experience on our platform.</p>
                 <p>Best regards,</p>
                 <p>MoPD Team</p>'''
                 msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
                 msg.attach_alternative(html_content, "text/html")
                 
                 if msg.send():
                     messages.success(request, 'Email Successfully Sent!')
                     messages.success(request, 'Your Account has been Successfully Created!')
                 print(email)                
                 return redirect('user-admin-user-list')
            except:
                messages.error(request, 'Please Try Again! Username and Email should be UNIQUE! ')
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
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request,email=email,password=password)

            if user is not None and user.is_superuser:
                login(request, user)
                return redirect('user-admin-index')
            elif user is not None and user.is_staff:
                login(request, user)
                if user.is_first_time:
                    return    
                return redirect('index')
            else:
                messages.error(request, 'Invalid Password or Email')
            form = Login_Form()
    else:
        form = Login_Form()
    return render(request, 'login.html', {'form': form})


@login_required(login_url='login')
@admin_user_required
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
@admin_user_required
def admin_profile(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            
            form = CustomUserCreationForm()   
    else:
        form = CustomUserCreationForm()

    return render(request, 'user-admin/profile.html', {'form': form})




@login_required(login_url='login')
@admin_user_required
def admin_profile_updated(request, pk):
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
@admin_user_required
def staff_profile_updated(request):
    user = CustomUser.objects.get(pk = request.user.pk)
    form = EditProfileForm(request.POST or None, request.FILES or None,instance=user)
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            messages.success(request, 'Successfully Updated!')
        else:
            messages.error(request, 'Please tye again!')  

    context = {
        'form' : form
    }       
    return render(request, 'setting.html', context)




@login_required(login_url='login')
@admin_user_required
def activate_deactivate_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    previous_page = request.META.get('HTTP_REFERER')
    
    if request.method == 'POST':
        user.is_active = not user.is_active  # Toggle the is_active status
        user.save()
        messages.success(request, f"User '{user.first_name} {user.last_name}' has been {'Activated ' if user.is_active else 'Deactivated'}!")
        return HttpResponseRedirect(previous_page)

    return render(request, 'user-admin/users_list.html', {'user': user})


    
@login_required(login_url='login')
def admin_change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_first_time = False
            user.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Successfully Updated!')
    else:
        form = PasswordChangeForm(request.user)
    
    return render(request,'user-admin/setting.html', {'formChangePassword': form})



@login_required(login_url='login')
def staff_change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_first_time = False
            user.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Successfully Updated!')
    else:
        form = PasswordChangeForm(request.user)
    
    return render(request,'password.html', {'form': form})




 