from django.shortcuts import render
from django. contrib import messages
from django.contrib.auth.decorators import login_required
from UserManagement.decorators import staff_user_required


@login_required(login_url='login')
@staff_user_required
def index(request):
    return render(request,"index.html")


@login_required(login_url='login')
@staff_user_required
def about(request):
    return render(request,"about.html")


@login_required(login_url='login')
@staff_user_required
def contact(request):
    return render(request,"contact.html")



@login_required(login_url='login')
@staff_user_required
def profile_view(request):
    return render(request,"profile.html")


@login_required(login_url='login')
@staff_user_required
def data(request):
    return render(request,"data.html")