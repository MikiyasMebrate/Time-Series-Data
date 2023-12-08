from django.shortcuts import render
from django. contrib import messages
from django.contrib.auth.decorators import login_required



@login_required(login_url='login')
def index(request):
    return render(request,"index.html")


@login_required(login_url='login')
def about(request):
    return render(request,"about.html")


@login_required(login_url='login')
def contact(request):
    return render(request,"contact.html")



@login_required(login_url='login')
def profile_view(request):
    return render(request,"profile.html")



def data(request):
    return render(request,"data.html")