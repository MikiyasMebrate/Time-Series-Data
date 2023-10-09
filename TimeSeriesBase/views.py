from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,"index.html")
def about(request):
    return render(request,"about.html")
def contact(request):
    return render(request,"contact.html")
def profile(request):
    return render(request,"profile.html")
def login(request):
    return render(request,"login.html")
def data(request):
    return render(request,"data.html")