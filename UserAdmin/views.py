import json
from django.shortcuts import get_object_or_404, render, HttpResponse, redirect
from django.http import JsonResponse
from django.urls import reverse
from django.contrib import messages
from TimeSeriesBase.models import *
from .forms import *
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
# Create your views here.
# @login_required
def index(request):
    return render(request, 'user-admin/index.html')

#Category

# @login_required
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
            messages.error(request, "Value Exist or Please Try again!")
            
    context = {
        'form' : form,
        'catagorys' : catagory
    }
    return render(request, 'user-admin/categories.html',context=context)

# @login_required
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

# @login_required
def delete_category(request,pk):
    catagorys = Category.objects.get(pk=pk)
    if catagorys.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-category')
    else:
        messages.error(request, "Value Exist or Please Try again!")
        return redirect('user-admin-category')
  

# @login_required
def filter_indicator(request, pk):
    single_indicator = Indicator.objects.get(pk = pk)
    returned_json = []
    returned_json.append(model_to_dict(single_indicator))
    indicators = list(Indicator.objects.all().values())
    year = list(DataPoint.objects.all().values())
    value = list(DataValue.objects.all().values())

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
        'year' : year,
        'value' : value
    }
    
    return JsonResponse(context)
    
    
   
#Data List    
# @login_required
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

 

# @login_required
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

# @login_required
def data_list_detail(request, pk):
    return render(request, 'user-admin/data_list_detail.html')



#Location
# @login_required

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

# @login_required
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

# @login_required
def delete_location(request,pk):
    location = Location.objects.get(pk=pk)
    if location.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-location')
    else:
        messages.error(request, "Value Exist or Please Try again!")
        

#Indicator 
# @login_required
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
            messages.error(request, "Value Exist or Please try Again!")
    context = {
        'form' : form,
        'indicators' : indicators
    }
    return render(request, 'user-admin/indicators.html', context)

# @login_required
def get_indicator_children_recursive(indicator):
    children = []
    for child in Indicator.objects.filter(parent=indicator):
        child_data = {
            'pk': child.pk,
            'title_ENG': child.title_ENG,
            'title_AMH': child.title_AMH,
            'created_at': child.created_at,
            'edit_url': reverse('user-admin-indicators-detail', args=[child.pk]),
        }
        grandchildren = get_indicator_children_recursive(child)
        if grandchildren:
            child_data['children'] = grandchildren
        children.append(child_data)
    return children

# @login_required
def indicator_sub_lists(request, pk):
    single_indicator = get_object_or_404(Indicator, pk=pk)
    sub_indicators = Indicator.objects.filter(parent=single_indicator)
    indicators = Indicator.objects.filter(parent=None)
    indicator_list_all = Indicator.objects.all()

    if request.method == "POST":
        form = IndicatorForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.parent = single_indicator
            obj.save()
            form.save_m2m()
            form = IndicatorForm()
            messages.success(request, "Indicator has been successfully added")
        else:
            messages.error(request, "Value Exist or Please try again!")
    else:
        form = IndicatorForm()

    immediate_children = get_indicator_children_recursive(single_indicator)
    context = {
        'form': form,
        'subIndicator': immediate_children,
        'indicators': indicators,
        'parent_indicator_pk': pk,
        'indicator_list_all': indicator_list_all,
        'single_indicator': single_indicator,
    }
    return render(request, 'user-admin/indicators.html', context)

# @login_required
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
            messages.error(request, 'Value Exist or Please Try Again!')
    context = {      
        'form' : form,
        'form_add' : form_add,
        'subIndicator' : sub_indicators,
        'indicator_list_all': indicator_list_all,
        'single_indicator' : single_indicator,
    }
    return render(request, 'user-admin/indicator_detail.html', context)

# @login_required
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
            messages.error(request, 'Value Exist or Please Try Again!')
            
    
    context = {
        'form' : form_add,
    }
    return render(request, 'user-admin/sub_indicator_add.html', context)

# @login_required
def delete_indicator(request,pk):
    indicator = Indicator.objects.get(pk=pk)
    
    if indicator.delete():
        messages.success(request, "Successfully Deleted")
        return redirect('user-admin-indicators')
    else:
        messages.error(request, "Value Exist or Please Try again!")
 
   
    
    
# @login_required
def measurement(request):
    return render(request, 'user-admin/measurement.html')

# @login_required
def profile(request):
    return render(request, 'user-admin/profile.html')


#Source
# @login_required
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

# @login_required
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

# @login_required
def delete_source(request,pk):
    source = Source.objects.get(pk=pk)
    if source.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-source')
    else:
        messages.error(request, "Value Exist or Please Try again!")
        return redirect('user-admin-source')

#topic
# @login_required
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
            messages.error(request, "Value Exist or Please Try again!")

    context = {
        'form' : form,
        'topics' : topics
    }
    return render(request, 'user-admin/topic.html',context=context)

# @login_required
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

# @login_required
def delete_topic(request,pk):
    topic = Topic.objects.get(pk=pk)
    if topic.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-topic')
    else:
        messages.error(request, "Value Exist or Please Try again!")
        return redirect('user-admin-topic')
 
 
#Data Point 
# @login_required
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
       
# @login_required
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

# @login_required
def data_point_delate(request, pk):
    data_point = DataPoint.objects.get(pk=pk)
    if data_point.delete():
        messages.success(request, "Successfully Deleted!")
        return redirect('user-admin-data-point')
    else:
        messages.error(request, "Value Exist or Please Try again!")
    


#Month
# @login_required
def month(request):
    months = Month.objects.all()
    context = {
        'months' : months,
    }
    return render(request, 'user-admin/month.html', context )


#User
# @login_required
def users_list(request):
    return render(request, 'user-admin/users_list.html')
