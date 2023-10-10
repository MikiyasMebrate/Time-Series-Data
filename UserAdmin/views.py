from django.shortcuts import render, HttpResponse
from django.contrib import messages
from TimeSeriesBase.models import Location
from .forms import LocationForm

# Create your views here.
def index(request):
    return render(request, 'user-admin/index.html')

def category(request):
    return render(request, 'user-admin/categories.html')

def data_list(request):
    return render(request, 'user-admin/data_list_view.html')

def data_list_detail(request):
    return render(request, 'user-admin/data_list_detail.html')

def indicator(request):
    return render(request, 'user-admin/indicators.html')

def location(request):
    
    location = Location.objects.all()
    
    form = LocationForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            form = form.save(commit=False)
            form.user = request.user
            form.save()
            form= LocationForm()
            messages.success(request, "Location has been successfully Added!")
        else:
            messages.error(request, "Please Try again!")
            
    context = {
        'form' : form,
        'locations' : location
    }
    return render(request, 'user-admin/location.html', context)

def measurement(request):
    return render(request, 'user-admin/measurement.html')

def profile(request):
    return render(request, 'user-admin/profile.html')

def source(request):
    return render(request, 'user-admin/source.html')

def topic(request):
    return render(request, 'user-admin/topic.html')

def users_list(request):
    return render(request, 'user-admin/users_list.html')
