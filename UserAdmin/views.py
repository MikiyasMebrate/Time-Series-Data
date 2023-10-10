from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from TimeSeriesBase.models import Location,Topic,Source
from .forms import LocationForm, IndicatorForm,TopicForm,SourceForm,MeasurmentForm


# Create your views here.
def index(request):
    return render(request, 'user-admin/index.html')

def category(request):
    return render(request, 'user-admin/categories.html')

def data_list(request):
    return render(request, 'user-admin/data_list_view.html')

def data_list_detail(request):
    return render(request, 'user-admin/data_list_detail.html')



#Location
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

#Indicator 
def indicator(request):
    form = IndicatorForm(request.POST or None)
    context = {
        'form' : form
    }
    return render(request, 'user-admin/indicators.html', context)
    
    
    
def measurement(request):
    return render(request, 'user-admin/measurement.html')

def profile(request):
    return render(request, 'user-admin/profile.html')

def source(request):
    sources = Source.objects.all()

    form = SourceForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            form = form.save(commit=False)
            form.save()
            form = SourceForm(request.POST or None)
            messages.success(request, "Source has been successfully Added!")
        else:
            messages.error(request, "Please Try again!")
            
    context = {
        'form' : form,
        'sources' : sources
    }
    return render(request, 'user-admin/source.html',context=context)

def topic(request):
    topics = Topic.objects.all()

    form = TopicForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            obj = form.save(commit=False)
            obj.save()
            form.save_m2m()
            form= TopicForm()
            messages.success(request, "Topic has been successfully Added!")
        else:
            messages.error(request, "Please Try again!")

    context = {
        'form' : form,
        'topics' : topics
    }
    print(topics)
    return render(request, 'user-admin/topic.html',context=context)

def users_list(request):
    return render(request, 'user-admin/users_list.html')
