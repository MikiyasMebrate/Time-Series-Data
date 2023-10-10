from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from TimeSeriesBase.models import Location,Category
from .forms import LocationForm,catagoryForm

# Create your views here.
def index(request):
    return render(request, 'user-admin/index.html')

def category(request):
    catagory = Category.objects.all()
    
    form = catagoryForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            form = form.save(commit=False)
            form.user = request.user
            form.save()
            form= catagoryForm()
            messages.success(request, "catagory has been successfully Added!")
        else:
            messages.error(request, "Please Try again!")
            
    context = {
        'form' : form,
        'catagorys' : catagory
    }
    return render(request, 'user-admin/categories.html',context)
def catagory_detail(request, pk):
    catagory = Category.objects.get(pk=pk)
    form = catagoryForm(request.POST or None, instance=catagory)
    
    if request.method == 'POST':
        if form.is_valid():
            form = form.save(commit=False)
            form.user = request.user
            form.save()
            messages.success(request, 'Successfully Updated')
            return redirect('user-admin-category')
        else:
            messages.error(request, 'Please try Again!')
    context = {
        'form' : form,
        'catagorys' : catagory
    }  
    return render(request, 'user-admin/catagories_detail.html', context)

def delete_category(request,pk):
    catagorys = Category.objects.get(pk=pk)
    if catagorys.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-category')
    else:
        messages.error(request, "Please Try again!")
        return redirect('user-admin-category')
    
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

def location_detail(request, pk):
    location = Location.objects.get(pk=pk)
    form = LocationForm(request.POST or None, instance=location)
    
    if request.method == 'POST':
        if form.is_valid():
            form = form.save(commit=False)
            form.user = request.user
            form.save()
            messages.success(request, 'Successfully Updated')
            return redirect('user-admin-location')
        else:
            messages.error(request, 'Please try Again!')
    context = {
        'form' : form,
        'location' : location
    }  
    return render(request, 'user-admin/location_detail.html', context)

def delete_location(request,pk):
    location = Location.objects.get(pk=pk)
    if location.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-location')
    else:
        messages.error(request, "Please Try again!")
        return redirect('user-admin-location')
    
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
