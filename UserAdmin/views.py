import json
from django.shortcuts import get_object_or_404, render, HttpResponse, redirect
from django.http import JsonResponse,HttpResponseRedirect
from django.urls import reverse
from django.contrib import messages
from TimeSeriesBase.models import *
from .forms import *
from django.contrib.auth.models import User
from django.forms.models import model_to_dict
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from TimeSeriesBase import models


def index(request):
    return render(request, 'user-admin/index.html')
def indicator_list(request, pk):
    category = Category.objects.get(pk = pk)
    indicator_list = Indicator.objects.filter(for_category = category)
    form = IndicatorForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            title_ENG = form.cleaned_data['title_ENG']
            title_AMH = form.cleaned_data['title_AMH']
            indicator_id = request.POST.get('indicator_Id')

            
            indicator_obj = Indicator.objects.get(id = indicator_id)
            indicator_obj.title_AMH = title_AMH
            indicator_obj.title_ENG = title_ENG
            indicator_obj.save()
            messages.success(request, 'Successfully Updated')
        else:
            messages.error(request, 'Please Try again! ')

    context = {
        'indicators' : indicator_list,
        'category' : category,
        'form' : form,
    }
    return render(request, 'user-admin/indicators.html', context)
    
#Category
def category(request, category_id=None):
    catagory = Category.objects.all()
    
    if request.method == 'POST':
        if 'catagory_Id' in request.POST:
            # Editing an existing category
            category_instance = get_object_or_404(Category, id=request.POST['catagory_Id'])
            form = catagoryForm(request.POST, instance=category_instance)
        else:
            # Adding a new category
            form = catagoryForm(request.POST)
        
        if form.is_valid():
            form.save()
            messages.success(request, "Category has been successfully added/updated!")
            return redirect('user-admin-category')

        messages.error(request, "Value exists or please try again!")

    else:
        # GET request or form is not valid, display the form
        if category_id:
            # Editing an existing category, populate the form with existing data
            category_instance = get_object_or_404(Category, id=category_id)
            form = catagoryForm(instance=category_instance)
        else:
            # Adding a new category
            form = catagoryForm()
            
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
            messages.error(request, 'Value Exist or Please try Again!')
    context = {
        'form' : form,
        'catagorys' : catagory
    }  
    return render(request, 'user-admin/catagories_detail.html', context)

def delete_category(request, pk):
    category = Category.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')
    
    # Soft delete the category
    category.is_deleted = True
    category.save()

    # Optionally, you can soft delete related objects here if needed
    
    messages.success(request, "Successfully Deleted!")
    return HttpResponseRedirect(previous_page)


#JSON
def filter_indicator_json(request):
    topic = list(Topic.objects.all().values())
    category_data = list(Category.objects.all().values())
    indicator = list(Indicator.objects.filter(~Q(for_category_id = None )).values())
    for category in category_data:
        category_obj = Category.objects.get(id=category['id'])
        related_topics = list(category_obj.topic.values())
        category['topics'] = related_topics
    context = {
        'topics' : topic,
        'categories' : category_data,
        'indicators' : indicator
    }

    return JsonResponse(context)

def filter_indicator(request, pk):
    single_indicator = Indicator.objects.get(pk = pk)
    returned_json = []
    returned_json.append(model_to_dict(single_indicator))
    indicators = list(Indicator.objects.all().values())
    year = list(DataPoint.objects.all().values())
    value = list(DataValue.objects.all().values())
    indicator_point = list(Indicator_Point.objects.all().values())
    measurements = list(Measurement.objects.all().values())

    # @login_required
    def child_list(parent, space):
        space = space + "   "
        for i in indicators:
            if i['parent_id'] == parent.id:
                returned_json.append(i)
                child_list(Indicator.objects.get(id = i['id']), space)
                    
    
    child_list(single_indicator, ' ')
    
    
    context = {
        'indicators' :  returned_json,
        'indicator_point': indicator_point,
        'year' : year,
        'value' : value,
        'measurements' : measurements
    }
    
    return JsonResponse(context)
      
def json(request):
    topic = Topic.objects.all()
    category = Category.objects.all()
    indicator = Indicator.objects.all()
    year = DataPoint.objects.all()
    value = DataValue.objects.all()
    
    topic_data = list(topic.values())
    category_data = list(category.values())
    indicator_data = list(indicator.values())
    year = list(year.values())
    values = list(value.values())

    # Retrieve the many-to-many related objects for each category
    for category in category_data:
        category_obj = Category.objects.get(id=category['id'])
        related_topics = list(category_obj.topic.values())
        category['topics'] = related_topics
        
        
    context = {
        'topics': topic_data,
        'categories': category_data,
        'indicators':indicator_data,
        'year' : year,
        'value' : values
    }
    return(JsonResponse(context))

    

#Data List
def data_list(request):
    form = dataListForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            topic = form.cleaned_data['topic']
            category = form.cleaned_data['category']
            is_interval = form.cleaned_data['is_interval']
            year = form.cleaned_data['year']
            indicator = form.cleaned_data['indicator']
            is_actual = form.cleaned_data['is_actual']
            type = form.cleaned_data['type']
            value = form.cleaned_data['value']
            source  = form.cleaned_data['source']
            
            check = DataValue.objects.filter(for_indicator = indicator, for_datapoint=year)
            if check.exists():
                return HttpResponse('The Data Already Added')
            else:
                i = DataValue.objects.create(value=value, for_datapoint=year, for_indicator=indicator)
                i.for_source.add(source)
                
                messages.success(request, 'Successfully Added!')
                return  HttpResponse('Successfully Added!')
        else:
            return  HttpResponse('error!')
            
    context = {
        'form' : form
    }
    return render(request, 'user-admin/data_list_view.html', context)

def data_list_detail(request, pk):
    form = ValueForm(request.POST or None)
    form_update = ValueForm2(request.POST or None)
    sub_indicator_form = SubIndicatorFormDetail(request.POST or None)
    indicator = Indicator.objects.get(pk = pk)
    print(indicator.measurement.parent)
    if request.method == 'POST':
        if form.is_valid():
            try:
                indicator_id = request.POST.get('indicator') 
                data_point_id = request.POST.get('data_point')
                value = form.cleaned_data['value']
                indicator_obj = Indicator.objects.get(pk = indicator_id)
                data_point_obj = DataPoint.objects.get(pk = data_point_id)
            
                value_obj = DataValue()
                value_obj.value = value
                value_obj.for_datapoint = data_point_obj
                value_obj.for_indicator = indicator_obj
                value_obj.save()
                form = ValueForm()
                messages.success(request, 'Successfully Added!')
            except: 
                None
        
        if form_update.is_valid():
            try:  
                value = form_update.cleaned_data['value2']
                value_id = request.POST.get('data_value')
                data_value = DataValue.objects.get(pk = value_id)
                data_value.value = value
                data_value.save()
                form_update = ValueForm2()
                messages.success(request, 'Successfully Added!')
            except:
                 None
            
    
        if sub_indicator_form.is_valid():
            try: 
                indicator_id = request.POST.get('addNewIndicator')
                indicator = Indicator.objects.get(pk = indicator_id)
                new_sub_indicator = Indicator()
                new_sub_indicator.title_ENG = sub_indicator_form.cleaned_data['title_ENG']
                new_sub_indicator.title_AMH =  sub_indicator_form.cleaned_data['title_AMH']
                new_sub_indicator.parent =  indicator
                new_sub_indicator.save()
    
                sub_indicator_form = SubIndicatorForm()
                messages.success(request, 'Successfully Added!')
            except: 
                None
        

                       
    context = {
        'form' : form,
        'form_update' : form_update,
        'sub_indicator_form' : sub_indicator_form,
        'indicator' : indicator
    }
    return render(request, 'user-admin/data_list_detail.html', context)



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
            messages.error(request, "Value Exist or Please Try again!")
            
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
            messages.error(request, 'Value Exist or Please try Again!')
    context = {
        'form' : form,
        'location' : location
    }  
    return render(request, 'user-admin/location_detail.html', context)

def delete_location(request,pk):
    location = Location.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')
    
    # Soft delete the category
    category.is_deleted = True
    category.save()

    # Optionally, you can soft delete related objects here if needed
    
    messages.success(request, "Successfully Deleted!")
    return HttpResponseRedirect(previous_page)
        

#Indicator 
def indicator(request):
    add_indicator = IndicatorForm(request.POST or None)
    
    if request.method == 'POST':
        if add_indicator.is_valid():
            add_indicator.save()
            messages.success(request, 'Successfully Added!')
        else:
            messages.error(request, 'Please Try Again!')
    
    context = {
        'add_indicator' : add_indicator,
    }
    return render(request, 'user-admin/indicators.html', context)


def indicator_list(request, pk):
    category = Category.objects.get(pk = pk)
    indicator_list = Indicator.objects.filter(for_category = category)
    form = IndicatorForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            title_ENG = form.cleaned_data['title_ENG']
            title_AMH = form.cleaned_data['title_AMH']
            indicator_id = request.POST.get('indicator_Id')

            
            indicator_obj = Indicator.objects.get(id = indicator_id)
            indicator_obj.title_AMH = title_AMH
            indicator_obj.title_ENG = title_ENG
            indicator_obj.save()
            messages.success(request, 'Successfully Updated')
        else:
            messages.error(request, 'Please Try again! ')

    context = {
        'indicators' : indicator_list,
        'category' : category,
        'form' : form,
    }
    return render(request, 'user-admin/indicators.html', context)

def indicator_detail(request, pk):
    indicator = Indicator.objects.get(pk = pk)
    indicator_list = Indicator.objects.filter(for_category = indicator.for_category)
    editIndicator = IndicatorForm(request.POST or None)
    addIndicator  = SubIndicatorForm(request.POST or None)

    if request.method == 'POST':
        if editIndicator.is_valid():
            indicator_id = request.POST.get('indicator_Id')
            indicator_title_AMH = editIndicator.cleaned_data['title_AMH']
            indicator_title_ENG = editIndicator.cleaned_data['title_ENG']
            try:
                indicator_obj  = Indicator.objects.get(pk = indicator_id)
                indicator_obj.title_AMH = indicator_title_AMH
                indicator_obj.title_ENG = indicator_title_ENG
                indicator_obj.save()
                messages.success(request, 'Successfully Updated!')
            except:
                messages.error(request, 'Please Try Again!')
        elif addIndicator.is_valid():
            parent_id = request.POST.get('addNewIndicator')
            indicator_title_AMH = addIndicator.cleaned_data['title_AMH_add']
            indicator_title_ENG = addIndicator.cleaned_data['title_ENG_add']
            try:
                parent_obj = Indicator.objects.get(pk = parent_id)
                new_indicator = Indicator()
                new_indicator.title_AMH = indicator_title_AMH
                new_indicator.title_ENG = indicator_title_ENG
                new_indicator.parent = parent_obj
                new_indicator.save()
                messages.success(request, 'Successfully Added!')
            except:
                messages.error(request, 'Please Try Again!')
    context = {
        'indicators' : indicator_list,
        'category' : category,
        'editIndicator' : editIndicator,
        'indicator' : indicator,
        'addIndicator' : addIndicator
    }
    return render(request, 'user-admin/location_detail.html', context)


def delete_indicator(request,pk):
    
    indicator = Indicator.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')
    indicator.is_deleted = True
    indicator.save()

    years = DataPoint.objects.all()
    for year in  years:
        try: 
           deleted_indicator = DataValue.objects.get(for_datapoint = year, for_indicator = indicator)
           deleted_indicator.is_deleted = True
           deleted_indicator.save()
        except:
            None
    messages.success(request, "Successfully Removed!")
    return HttpResponseRedirect(previous_page)

       

def measurement(request):
    return render(request, 'user-admin/measurement.html')

# @login_required
# def profile(request):
#     return render(request, 'user-admin/profile.html')


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
            messages.error(request, "Value Exist or Please Try again!")
            
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
            messages.error(request, 'Value Exist or Please try Again!')
    context = {
        'form' : form,
        'source' : source
    }  
    return render(request, 'user-admin/source_detail.html', context)

def delete_source(request,pk):
    source = Source.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')
    
    # Soft delete the category
    source.is_deleted = True
    source.save()

    # Optionally, you can soft delete related objects here if needed
    
    messages.success(request, "Successfully Deleted!")
    return HttpResponseRedirect(previous_page)

def topic(request, topic_id=None):
    topics = Topic.objects.all()

    # If topic_id is provided, it's an update operation
    if topic_id:
        topic_instance = get_object_or_404(Topic, pk=topic_id)
    else:
        # If it's not an update operation, check if the topic_id is present in the POST data
        topic_instance = None
        if 'topic_Id' in request.POST:
            topic_instance = get_object_or_404(Topic, id=request.POST['topic_Id'])

    # Initialize form with or without data
    form = TopicForm(request.POST or None, instance=topic_instance)

    if request.method == 'POST':
        if form.is_valid():
            obj = form.save()
            messages.success(request, "Topic has been successfully added/updated!")

            # Redirect to the same page if it's a new topic, otherwise, redirect with the topic_id
            return redirect('user-admin-topic') if not topic_id else redirect('user-admin-topic-update', topic_id=obj.id)
        else:
            messages.error(request, "Value exists or please try again!")

    context = {'form': form, 'topics': topics, 'topic_id': topic_id}
    return render(request, 'user-admin/topic.html', context=context)


#JSON
def json_filter_topic(request):
    topics = Topic.objects.all()
    
    # Creating a list of dictionaries representing each topic
    topics_data = []
    for topic in topics:
        topics_data.append({
            'id': topic.id,
            'title_ENG': topic.title_ENG,
            'title_AMH': topic.title_AMH,
            'user': topic.user.username if topic.user else None,
            'updated': topic.updated.isoformat(),
            'created': topic.created.isoformat(),
            'is_deleted': topic.is_deleted,
        })

    # Returning the list as JSON
    return JsonResponse({'topics': topics_data})

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
            messages.error(request, 'Value Exist or Please try Again!')
    context = {
        'form' : form,
        'topic' : topic
    }  
    return render(request, 'user-admin/topic_detail.html', context)

def delete_topic(request,pk):
    topic = Topic.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')
    
    # Soft delete the category
    topic.is_deleted = True
    topic.save()

    # Optionally, you can soft delete related objects here if needed
    
    messages.success(request, "Successfully Deleted!")
    return HttpResponseRedirect(previous_page)
 
 
#Data Point 
def data_point(request):
    data_points = DataPoint.objects.all()
    form = DataPointForm(request.POST or None)
    
    if request.method == 'POST':
        if form.is_valid():
            obj = form.save(commit=False)
            check_interval = form.cleaned_data['is_interval']
            
            if(check_interval):
                year_et_start = form.cleaned_data['year_start_EC']
                year_et_end = form.cleaned_data['year_end_EC']
                
                obj.year_start_GC = f'{str(int(year_et_start) + 7)}/{str(int(year_et_start) + 8)}'
                obj.year_end_GC =  f'{str(int(year_et_end) + 7)}/{str(int(year_et_end) + 8)}'
            else:
                year_ec = form.cleaned_data['year_EC']
                obj.year_GC = f'{str(int(year_ec )+ 7)}/{str(int(year_ec)+ 8)}'
            
            
            obj.save()
            form = DataPointForm()
            messages.success(request, 'Successfully Created')
        else:
            messages.error(request, 'Value Exist or Please Try Again!')
    
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
            obj = form.save(commit=False)
            check_interval = form.cleaned_data['is_interval']
            
            if(check_interval):
                year_et_start = form.cleaned_data['year_start_EC']
                year_et_end = form.cleaned_data['year_end_EC']
                
                obj.year_start_GC = f'{str(int(year_et_start) + 7)}/{str(int(year_et_start) + 8)}'
                obj.year_end_GC =  f'{str(int(year_et_end) + 7)}/{str(int(year_et_end) + 8)}'
            else:
                year_ec = form.cleaned_data['year_EC']
                obj.year_GC = f'{str(int(year_ec )+ 7)}/{str(int(year_ec)+ 8)}'
            
            
            obj.save()
            form = DataPointForm()
            messages.success(request, 'Successfully Created')
            return redirect('user-admin-data-point')
        else:
            messages.error(request, 'Value Exist or Please Try Again!')
            
    context = {
        'data_point' : data_point,
        'form' : form
    }
    
    return render(request, 'user-admin/data_point_detail.html', context )

def delete_data_point(request, pk):
    data_point = DataPoint.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')
    
    # Soft delete the category
    data_point.is_deleted = True
    data_point.save()

    # Optionally, you can soft delete related objects here if needed
    
    messages.success(request, "Successfully Deleted!")
    return HttpResponseRedirect(previous_page)
    


#Month
def month(request):
    months = Month.objects.all()
    context = {
        'months' : months,
    }
    return render(request, 'user-admin/month.html', context )


#User
# @login_required
# def users_list(request):
#     return render(request, 'user-admin/users_list.html')
# def users_list(request):
#      item2=CustomUser.objects.all()
#      count2=item2.count()
#      context={
#          'count2':count2
#      }
#      return render(request, 'user-admin/users_list.html',context)
 
def recyclebin(request):
     return render(request, 'user-admin/recyclebin.html')
