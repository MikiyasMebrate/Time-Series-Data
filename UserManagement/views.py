from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from django.urls import reverse
from TimeSeriesBase.models import *
from .forms import *
from django.shortcuts import render, redirect
from .models import CustomUser
from django.contrib.auth import login,authenticate,logout,get_user_model
from  .decorators import admin_user_required, staff_user_required
from django.contrib.auth.decorators import login_required
import random
import string
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash

#forget passsword
from TimeSeriesBase.forms import CustomUserSetPasswordForm
# views.py
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import authenticate, login
from django.utils.encoding import force_bytes, smart_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.urls import reverse_lazy

User = get_user_model()


def forget_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'User with this email does not exist.')
            return redirect('forget_password')

        # Generate token and uidb64
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        # Generate reset URL
        reset_url = reverse_lazy('reset_password', kwargs={'token': token, 'uidb64': uidb64})
        reset_url = request.build_absolute_uri(reset_url)
        print(reset_url)

        subject = 'Reset Your Password'
        message = f'Click the link below to reset your password:\n\n{reset_url}'
        send_mail(subject, message, 'habtamutesfaye.com@gmail.com', [user.email])

        messages.success(request, 'Password reset link has been sent to your email.')
        return redirect('forget_password')

    return render(request, 'forget_pass.html')


# views.py

def reset_password(request, token, uidb64):
    try:
        uid = smart_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        # Check if last_reset_password is set and compare the time
        if user.last_reset_password and timezone.now() - user.last_reset_password > timezone.timedelta(hours=1):
            messages.error(request, 'The reset password link has expired. Please request a new one.')
            return redirect('forget_password')

        if request.method == 'POST':
            # Use get() with a default value to avoid MultiValueDictKeyError
            password = request.POST.get('new_password1', '')
            form = CustomUserSetPasswordForm(user, {'new_password1': password, 'new_password2': password})
            if form.is_valid():
                form.save()

                # Log the user in after password reset
                user = authenticate(request, username=user.email, password=password)
                login(request, user)

                # Redirect to the success page
                return redirect('reset_password_confirm')
        else:
            form = CustomUserSetPasswordForm(user)

        return render(request, 'reset_password.html', {'form': form})
    else:
        messages.error(request, 'The reset password link is invalid or has expired. Please request a new one.')
        return redirect('forget_password')

    
def reset_password_confirm(request):
    return render(request, 'sucess.html')

#forget password end


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
def admin_profile_updated(request):
    user = CustomUser.objects.get(pk = request.user.pk)
    form = EditProfileForm(request.POST or None, request.FILES or None,instance=user)
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            messages.success(request, 'Successfully Updated!')
        else:
            messages.error(request, 'Please tye again!')         
    return render(request, 'user-admin/profile.html', {'form': form, 'user': user})


@login_required(login_url='login')
@staff_user_required
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




 