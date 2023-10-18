from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.urls import reverse
from django.contrib import messages
from TimeSeriesBase.models import *
from .forms import *
# Create your views here.
def index(request):
    return render(request, 'user-admin/index.html')

#Category
def category(request):
    catagory = Category.objects.all()
    
    form = catagoryForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            obj = form.save(commit=False)
            obj.save()
            form.save_m2m()
            form= catagoryForm()
            messages.success(request, "catagory has been successfully Added!")
        else:
            messages.error(request, "Please Try again!")
            
    context = {
        'form' : form,
        'catagorys' : catagory
    }
    return render(request, 'user-admin/categories.html',context=context)

def catagory_detail(request, pk):
    catagory = Category.objects.get(pk=pk)
    form = catagoryForm(request.POST or None, instance=catagory)
    
    if request.method == 'POST':
        if form.is_valid():
            obj = form.save(commit=False)
            obj.save()
            form.save_m2m()
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
  
  
#Data List    
def json(request):
    topic = Topic.objects.all()
    category = Category.objects.all()
    indicator = Indicator.objects.all()
    
    topic_data = list(topic.values())
    category_data = list(category.values())
    indicator_data = list(indicator.values())

    # Retrieve the many-to-many related objects for each category
    for category in category_data:
        category_obj = Category.objects.get(id=category['id'])
        related_topics = list(category_obj.topic.values())
        category['topics'] = related_topics
        
        
    context = {
        'topics': topic_data,
        'categories': category_data,
        'indicators':indicator_data
    }
    return(JsonResponse(context))


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
        

#Indicator 
def indicator(request):
    indicators = Indicator.objects.filter(parent = None)
    form = IndicatorForm(request.POST or None)
    
    if request.method == "POST":
        if form.is_valid():
            obj = form.save(commit=False)
            obj.save()
            form.save_m2m()
            form = IndicatorForm()
            messages.success(request, "Indicator has been successfully Added")
        else:
            messages.error(request, "Please try Again!")
    context = {
        'form' : form,
        'indicators' : indicators
    }
    return render(request, 'user-admin/indicators.html', context)

def indicator_sub_lists(request,pk):
    single_indicator = Indicator.objects.get(pk=pk)
    indicators = Indicator.objects.filter(parent = None)
    sub_indicators = Indicator.objects.filter(parent__pk = pk)
    form = IndicatorForm(request.POST or None)
    indicator_list_all = Indicator.objects.all()
    
    
    def print_child(parent,space):
        space = space +  "  "
        for child in Indicator.objects.all():
            if child.parent == parent:
                print(space,child)
                print_child(child,space)
        
                
    
    print("Parent: ", single_indicator)
    for child in Indicator.objects.all():
            if child.parent == single_indicator:
                print(child)
                print_child(child, " ")

    if request.method == "POST":
        if form.is_valid():
            obj = form.save(commit=False)
            obj.save()
            form.save_m2m()
            form = IndicatorForm()
            messages.success(request, "Indicator has been successfully Added")
        else:
            messages.error(request, "Please try Again!")
    
    context = {
        'form' : form,
        'subIndicator' : sub_indicators,
        'indicators' : indicators,
        'indicator_list_all': indicator_list_all,
        'single_indicator' : single_indicator,
    }
    return render(request, 'user-admin/indicators.html', context)

def indicator_detail(request, pk):
    single_indicator = Indicator.objects.get(pk=pk)
    sub_indicators = Indicator.objects.filter(parent__pk=pk)
    indicator_list_all = Indicator.objects.all()
    form_add = SubIndicatorForm(request.POST or None, prefix='form_add')
    form = IndicatorForm(request.POST or None, instance=single_indicator, prefix='form')
    
    if request.method == 'POST':
        if form.is_valid():
            obj = form.save(commit=False)
            obj.save()
            form.save_m2m()
            form = IndicatorForm(request.POST or None, instance=single_indicator)
            messages.success(request, 'Successfully Updated')
            return redirect('user-admin-indicators')
        elif form_add.is_valid():
            obj = form_add.save(commit=False)
            obj.parent = single_indicator
            obj.save()
            form_add.save_m2m()
            form = IndicatorForm(request.POST or None, instance=single_indicator)
            form_add = SubIndicatorForm()
            messages.success(request, 'Successfully Added') 
            return redirect(request.path_info)
        else:
            messages.error(request, 'Please Try Again!')
    context = {      
        'form' : form,
        'form_add' : form_add,
        'subIndicator' : sub_indicators,
        'indicator_list_all': indicator_list_all,
        'single_indicator' : single_indicator,
    }
    return render(request, 'user-admin/indicator_detail.html', context)

def indicator_detail_add(request, pk, mainParent ):
    indicator = Indicator.objects.get(pk=pk)
    form_add = SubIndicatorForm(request.POST or None)

    if request.method == 'POST':
        if form_add.is_valid():
            obj = form_add.save(commit=False)
            obj.parent = indicator
            obj.save()
            form_add.save_m2m()
            form_add = SubIndicatorForm()
            messages.success(request, 'Successfully Added') 
            redirect_url = reverse('user-admin-indicator-sub', kwargs={'pk': mainParent})
            return redirect(redirect_url)
      
        else:
            messages.error(request, 'Please Try Again!')
            
    
    context = {
        'form' : form_add,
    }
    return render(request, 'user-admin/sub_indicator_add.html', context)

def delete_indicator(request,pk):
    indicator = Indicator.objects.get(pk=pk)
    
    if indicator.delete():
        messages.success(request, "Successfully Deleted")
        return redirect('user-admin-indicators')
    else:
        messages.error(request, "Please Try again!")
 
   
    
    
def measurement(request):
    return render(request, 'user-admin/measurement.html')

def profile(request):
    return render(request, 'user-admin/profile.html')


#Source
def source(request):
    sources = Source.objects.all()

    form = SourceForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            form = form.save(commit=False)
            form.save()
            form = SourceForm()
            messages.success(request, "Source has been successfully Added!")
        else:
            messages.error(request, "Please Try again!")
            
    context = {
        'form' : form,
        'sources' : sources
    }
    return render(request, 'user-admin/source.html',context=context)

def source_detail(request, pk):
    source = Source.objects.get(pk=pk)
    
    form = SourceForm(request.POST or None, instance=source)
    
    if request.method == 'POST':
        if form.is_valid():
            form = form.save(commit=False)
            form.user = request.user
            form.save()
            messages.success(request, 'Successfully Updated')
            return redirect('user-admin-source')
        else:
            messages.error(request, 'Please try Again!')
    context = {
        'form' : form,
        'source' : source
    }  
    return render(request, 'user-admin/source_detail.html', context)

def delete_source(request,pk):
    source = Source.objects.get(pk=pk)
    if source.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-source')
    else:
        messages.error(request, "Please Try again!")
        return redirect('user-admin-source')

#topic
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
    return render(request, 'user-admin/topic.html',context=context)

def topic_detail(request, pk):
    topic = Topic.objects.get(pk=pk)
    form = TopicForm(request.POST or None, instance=topic)
    
    if request.method == 'POST':
        if form.is_valid():
            obj = form.save(commit=False)
            obj.save()
            form.save_m2m()
            messages.success(request, 'Successfully Updated')
            return redirect('user-admin-topic')
        else:
            messages.error(request, 'Please try Again!')
    context = {
        'form' : form,
        'topic' : topic
    }  
    return render(request, 'user-admin/topic_detail.html', context)

def delete_topic(request,pk):
    topic = Topic.objects.get(pk=pk)
    if topic.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-topic')
    else:
        messages.error(request, "Please Try again!")
        return redirect('user-admin-topic')
 
 
#Data Point 
def data_point(request):
    data_points = DataPoint.objects.all()
    form = DataPointForm(request.POST or None)
    
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            form = DataPointForm()
            messages.success(request, 'Successfully Created')
        else:
            messages.error(request, 'Please Try Again!')
    
    context = {
        'form' : form,
        'data_points' : data_points 
    }
    return render(request, 'user-admin/data_point.html', context)     
       
def data_point_detail(request, pk):
    data_point = DataPoint.objects.get(pk = pk) 
    form = DataPointForm(request.POST or None, instance=data_point)
    
    if request.method == 'POST':
        if form.is_valid():
            form = form.save()
            messages.success(request, 'Successfully Updated')
            return redirect('user-admin-data-point')
        else:
            messages.error(request, 'Please try Again!')
    
    context = {
        'data_point' : data_point,
        'form' : form
    }
    
    return render(request, 'user-admin/data_point_detail.html', context )

def data_point_delate(request, pk):
    data_point = DataPoint.objects.get(pk=pk)
    if data_point.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-data-point')
    else:
        messages.error(request, "Please Try again!")
    


#Month
def month(request):
    months = Month.objects.all()
    context = {
        'months' : months,
    }
    return render(request, 'user-admin/month.html', context )


#User
def users_list(request):
    return render(request, 'user-admin/users_list.html')
