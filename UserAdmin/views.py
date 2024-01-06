
from django.shortcuts import get_object_or_404, render, HttpResponse, redirect
from django.http import Http404, JsonResponse,HttpResponseRedirect
from django.contrib import messages
from TimeSeriesBase.models import *
from .forms import *
from django.forms.models import model_to_dict
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from UserManagement.decorators import *
from auditlog.models import LogEntry
from datetime import datetime, timezone
from TimeSeriesBase.admin import TopicResource, handle_uploaded_Topic_file, handle_uploaded_Category_file
from tablib import Dataset

@login_required(login_url='login')
@admin_user_required
def audit_log_list(request):
    auditlog_entries = LogEntry.objects.all()
    return render(request, 'user-admin/audit.html', {'auditlog_entries': auditlog_entries})


@login_required(login_url='login')
@admin_user_required
def index(request):
    auditlog_entries = LogEntry.objects.filter()[:6]
    size_topic = Topic.objects.filter(is_deleted = False).count()
    size_category = Category.objects.filter(is_deleted = False).count()
    size_indicator = Indicator.objects.filter(is_deleted = False).count()
    size_source = Source.objects.filter(is_deleted = False).count()

    context = {
        'size_topic' : size_topic,
        'size_category' : size_category,
        'size_indicator'  : size_indicator,
        'size_source' : size_source,
        'auditlog_entries': auditlog_entries
    }

    return render(request, 'user-admin/index.html', context)

# @login_required(login_url='login')
# @admin_user_required
# def indicator_list(request, pk):
#     category = Category.objects.get(pk = pk)
#     indicator_list = Indicator.objects.filter(for_category = category)
#     form = IndicatorForm(request.POST or None)
#     if request.method == "POST":
#         if form.is_valid():
#             title_ENG = form.cleaned_data['title_ENG']
#             title_AMH = form.cleaned_data['title_AMH']
#             indicator_id = request.POST.get('indicator_Id')

            
#             indicator_obj = Indicator.objects.get(id = indicator_id)
#             indicator_obj.title_AMH = title_AMH
#             indicator_obj.title_ENG = title_ENG
#             indicator_obj.save()
#             messages.success(request, 'Successfully Updated')
#         else:
#             messages.error(request, 'Please Try again! ')

#     context = {
#         'indicators' : indicator_list,
#         'category' : category,
#         'form' : form,
#     }
#     return render(request, 'user-admin/indicators.html', context)
    
#Category
@login_required(login_url='login')
@admin_user_required
def category(request, category_id=None):
    catagory = Category.objects.all()
    formFile = ImportFileForm()


    if request.method == 'POST':
        catagory_id_str = request.POST.get('catagory_Id', '')
        if catagory_id_str.isdigit():
            try:
                category_instance = get_object_or_404(Category, id=int(catagory_id_str))
                form = catagoryForm(request.POST, instance=category_instance)
            except Http404 as e:
                messages.error(request, "Invalid category ID provided.")
                return redirect('user-admin-category')
        else:
            # Adding a new category, set category_id to None
            category_instance = None
            form = catagoryForm(request.POST)

        if 'addcatagory' in request.POST:
            if form.is_valid():
                form.save()
                if category_instance:
                    messages.success(request, "Category has been successfully updated!")
                else:
                    messages.success(request, "Category has been successfully added!")
                return redirect('user-admin-category')
            else:
                messages.error(request, "Value exists or please try again!")
        
        if 'fileCategoryValue' in request.POST:
            formFile = ImportFileForm(request.POST, request.FILES )
            if formFile.is_valid():
                file = request.FILES['file']
                success, message = handle_uploaded_Category_file(file)
                
                if success:
                    messages.success(request, message)
                else:
                    messages.error(request, message)
    
            else:
                messages.error(request, 'File not recognized')

    else:
        # GET request or form is not valid, display the form
        if category_id:
            try:
                category_instance = get_object_or_404(Category, id=category_id)
                form = catagoryForm(instance=category_instance)
            except Http404 as e:
                messages.error(request, "Invalid category ID provided.")
                return redirect('user-admin-category')
        else:
            # Adding a new category
            form = catagoryForm()
            formFile = ImportFileForm()
            
    context = {
        'form': form,
        'catagorys': catagory,
        'formFile' : formFile
    }
    return render(request, 'user-admin/categories.html', context=context)


@login_required(login_url='login')
@admin_user_required
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

@login_required(login_url='login')
@admin_user_required
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
@login_required(login_url='login')
def filter_indicator_json(request):
    topic = list(Topic.objects.all().values())
    category_data = list(Category.objects.all().values())
    indicator = list(Indicator.objects.filter(~Q(for_category_id = None )).values())
    context = {
        'topics' : topic,
        'categories' : category_data,
        'indicators' : indicator
    }

    return JsonResponse(context)

@login_required(login_url='login')
def filter_indicator(request, pk):
    single_indicator = Indicator.objects.get(pk = pk)
    returned_json = []
    returned_json.append(model_to_dict(single_indicator))
    indicators = list(Indicator.objects.all().values())
    year = list(DataPoint.objects.all().values())
    value = list(DataValue.objects.all().values())
    indicator_point = list(Indicator_Point.objects.filter(for_indicator = pk).values())
    measurements = list(Measurement.objects.all().values())
    month = list(Month.objects.all().values())
    quarter = list(Quarter.objects.all().values())

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
        'measurements' : measurements,
        'month' : month,
        'quarter' : quarter
    }
    
    return JsonResponse(context)

@login_required(login_url='login')
def json_filter_source(request):
    sources = Source.objects.all()

    # Creating a list of dictionaries representing each source
    sources_data = []
    for source in sources:
        sources_data.append({
            'id': source.id,
            'title_ENG': source.title_ENG,
            'title_AMH': source.title_AMH,
            'updated': source.updated.isoformat(),
            'created': source.created.isoformat(),
            'is_deleted': source.is_deleted,
        })

    # Returning the list as JSON
    return JsonResponse({'sources': sources_data}) 

@login_required(login_url='login')
def json_filter_topic(request):
    topics = Topic.objects.all()
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

@login_required(login_url='login')
def filter_catagory_json(request):
    category_data = list(Category.objects.all().values())
    
    for category in category_data:
        try:
            category_obj = Category.objects.get(id=category['id'])
            related_topic = category_obj.topic
            category['topic'] = {'id': related_topic.id, 'title_ENG': related_topic.title_ENG, 'title_AMH': related_topic.title_AMH} if related_topic else {}
        except Category.DoesNotExist:
            category['topic'] = {}  # Set topic to an empty dictionary if the category has no related topic


    context = {
        'categories': category_data,
    }

    return JsonResponse(context)

@login_required(login_url='login')
def json_measurement(request):
    measurements = list(Measurement.objects.all().values())
    
    context = {
        'measurements' : measurements
    }
    return JsonResponse(context)

def json_measurement_byID(request, measurement_id=None):
    # If measurement_id is provided, fetch the specific measurement
    if measurement_id is not None:
        measurement = Measurement.objects.filter(id=measurement_id).values().first()

        if measurement is None:
            # Return a 404 response if the measurement with the given ID is not found
            return JsonResponse({'error': 'Measurement not found'}, status=404)

        # Return the specific measurement
        return JsonResponse({'measurement': measurement})

    # If no measurement_id is provided, return the list of all measurements
    measurements = list(Measurement.objects.all().values())
    context = {
        'measurements': measurements
    }
    return JsonResponse(context)

from django.http import JsonResponse

@login_required(login_url='login')
def json(request):
    topic = Topic.objects.all()
    category = Category.objects.all()
    indicator = Indicator.objects.all()
    indicator_point = Indicator_Point.objects.all()
    year = DataPoint.objects.all()
    value = DataValue.objects.all()
    month = Month.objects.all()
    quarter = Quarter.objects.all()
    measurement = Measurement.objects.all()
    
    topic_data = list(topic.values())
    category_data = list(category.values())
    indicator_data = list(indicator.values())
    indicator_point_data = list(indicator_point.values())
    year = list(year.values())
    values = list(value.values())
    months = list(month.values())
    quarters = list(quarter.values())
    measurement_data = list(measurement.values())

        # Add Amount_ENG attribute to each indicator
    for ind in indicator_data:
        measurement_id = ind.get('measurement_id')
        if measurement_id is not None:
            matching_measurement = next((m for m in measurement_data if m['id'] == measurement_id), None)
            ind['Amount_ENG'] = matching_measurement['Amount_ENG'] if matching_measurement else None
        else:
            ind['Amount_ENG'] = None


    context = {
        'topics': topic_data,
        'categories': category_data,
        'indicators':indicator_data,
        'indicator_point' : indicator_point_data,
        'year' : year,
        'quarter' : quarters,
        'month' : months,
        'value' : values
    }
    return JsonResponse(context)


    

#Data List
@login_required(login_url='login')
@admin_user_required
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

@login_required(login_url='login')
@admin_user_required
def data_list_detail(request, pk):
    form = ValueForm()
    form_update = ValueForm2()
    sub_indicator_form = SubIndicatorFormDetail()
    indicator = Indicator.objects.get(pk = pk)
    measurement_form = MeasurementSelectForm()

    if request.method == 'POST':
        if 'addValueIndicator' in request.POST:
            form = ValueForm(request.POST)
            if form.is_valid():
                if indicator.type_of == 'yearly':
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
                        return redirect(request.path)
                    except: 
                        messages.error(request, 'Please Try Again To Edit Indicator!')
                elif indicator.type_of == 'monthly':
                    try:
                        indicator_id = request.POST.get('indicator') 
                        data_point_id = request.POST.get('data_point')
                        month_id = request.POST.get('month')
                        value = form.cleaned_data['value']


                        indicator_obj = Indicator.objects.get(pk = indicator_id)
                        data_point_obj = DataPoint.objects.get(pk = data_point_id)
                        month_obj = Month.objects.get(pk = month_id)
                    
                        value_obj = DataValue()
                        value_obj.value = value
                        value_obj.for_datapoint = data_point_obj
                        value_obj.for_indicator = indicator_obj
                        value_obj.for_month = month_obj
                        value_obj.save()
                        form = ValueForm()
                        messages.success(request, 'Successfully Added!')
                        return redirect(request.path)
                    except: 
                        messages.error(request, 'Please Try Again To Edit Indicator!')              
                elif indicator.type_of == 'quarterly':
                    try:
                        indicator_id = request.POST.get('indicator') 
                        data_point_id = request.POST.get('data_point')
                        quarter_id = request.POST.get('quarter')
                        value = form.cleaned_data['value']


                        indicator_obj = Indicator.objects.get(pk = indicator_id)
                        data_point_obj = DataPoint.objects.get(pk = data_point_id)
                        quarter = Quarter.objects.get(pk = quarter_id)
                    
                        value_obj = DataValue()
                        value_obj.value = value
                        value_obj.for_datapoint = data_point_obj
                        value_obj.for_indicator = indicator_obj
                        value_obj.for_quarter = quarter
                        value_obj.save()
                        form = ValueForm()
                        messages.success(request, 'Successfully Added!')
                        return redirect(request.path)
                    except: 
                        messages.error(request, 'Please Try Again To Edit Indicator!')
        
        if 'editFormIndicatorValue' in request.POST:
            form_update = ValueForm2(request.POST)
            if form_update.is_valid():
                try:  
                    value = form_update.cleaned_data['value2']
                    value_id = request.POST.get('data_value')
                    data_value = DataValue.objects.get(pk = value_id)
                    data_value.value = value
                    data_value.save()
                    form_update = ValueForm2()
                    messages.success(request, 'Successfully Added!')
                    return redirect(request.path)
                except:
                    messages.error(request, 'Please Try Again To Update Indicator!')
        
        if 'formAddIndicator' in request.POST:
            sub_indicator_form = SubIndicatorFormDetail(request.POST)
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
                    return redirect(request.path)
                except: 
                    messages.error(request, 'Please Try Again To Add New Sub-Indicator!')
        
        if 'measurementFormId' in request.POST:
            measurement_form = MeasurementSelectForm(request.POST)
            if measurement_form.is_valid():
                try:
                    measurement_id = measurement_form.cleaned_data['measurement_form']
                    measurement = Measurement.objects.get(pk = measurement_id)
                    indicator.measurement = measurement
                    indicator.save()
                    messages.success(request, 'Successfully measurement Updated!')
                    return redirect(request.path)
                except:
                    messages.error(request, 'Please Try Again!')
            else:
                messages.error(request, 'Please Try Again not valid!')
        
        if 'indicatorYearId' in request.POST:
            is_actual = request.POST.get('isActualInput')
            is_actual_data_point_id = request.POST.get('indicatorYearId')

            try:    
                indicator_point = Indicator_Point.objects.get(for_indicator = indicator, for_datapoint = is_actual_data_point_id)
            except:
                indicator_point = None

            try:
                data_point = DataPoint.objects.get(pk = is_actual_data_point_id)
            except:
                data_point = None

            #Is Indicator Point is Found
            if(indicator_point):
                if(is_actual):
                    indicator_point.is_actual = True
                else:
                    indicator_point.is_actual = False
                 
                indicator_point.save()
                messages.success(request, 'Successfully Actual Point updated!')
            elif(data_point):
                indicator_obj = Indicator_Point()
                indicator_obj.for_indicator = indicator
                indicator_obj.for_datapoint = data_point
                if(is_actual):
                    indicator_obj.is_actual = True
                else:
                    indicator_obj.is_actual = False
                
                indicator_obj.save()
                messages.success(request, 'Successfully Actual Point Added!')
            else:
                messages.error(request, 'Please Try Again!')
                
            
                       
    context = {
        'form' : form,
        'form_update' : form_update,
        'sub_indicator_form' : sub_indicator_form,
        'indicator' : indicator,
        'measurement_form' :measurement_form,
    }
    return render(request, 'user-admin/data_list_detail.html', context)

       

#Indicator 
@login_required(login_url='login')
@admin_user_required
def indicator(request):
    add_indicator = IndicatorForm(request.POST or None)
    formFile = ImportFileForm()
    
    if request.method == 'POST':
        if 'formAddIndicator' in request.POST:
            if add_indicator.is_valid():
                add_indicator.save()
                messages.success(request, 'Successfully Added!')
            else:
                messages.error(request, 'Please Try Again!')

        if 'fileIndicatorFile' in request.POST:
            formFile = ImportFileForm(request.POST, request.FILES )
            if formFile.is_valid():
                file = request.FILES['file']
                success, message = handle_uploaded_Category_file(file)
                
                if success:
                    messages.success(request, message)
                else:
                    messages.error(request, message)
    
            else:
                messages.error(request, 'File not recognized')
    
    context = {
        'add_indicator' : add_indicator,
        'formFile' : formFile
    }
    return render(request, 'user-admin/indicators.html', context)


@login_required(login_url='login')
@admin_user_required
def indicator_list(request, pk):
    add_indicator = IndicatorForm()
    category = Category.objects.get(pk = pk)
    indicator_list = Indicator.objects.filter(for_category = category)
    form = IndicatorForm(request.POST or None)
    formFile = ImportFileForm()
    if request.method == "POST":
        if 'form_indicator_edit' in request.POST:
            form = IndicatorForm(request.POST)
            if form.is_valid():
                title_ENG = form.cleaned_data['title_ENG']
                title_AMH = form.cleaned_data['title_AMH']
                category_obj = form.cleaned_data['for_category']
                type_of_obj = form.cleaned_data['type_of']
                indicator_id = request.POST.get('indicator_Id')
    
                indicator_obj = Indicator.objects.get(id = indicator_id)
                indicator_obj.title_AMH = title_AMH
                indicator_obj.title_ENG = title_ENG
                indicator_obj.for_category = category_obj
                indicator_obj.type_of = type_of_obj
                indicator_obj.save()
                form = IndicatorForm()
                messages.success(request, 'Successfully Updated')
            else:
                messages.error(request, 'Please Try Again')

        if 'formAddIndicator' in request.POST:
            add_indicator = IndicatorForm(request.POST)
            if add_indicator.is_valid():
                add_indicator.save()
                add_indicator = IndicatorForm()
                messages.success(request, 'Successfully Added!')
            else:
                messages.error(request, 'Please Try again! ')
        
        if 'fileIndicatorFile' in request.POST:
            formFile = ImportFileForm(request.POST, request.FILES )
            if formFile.is_valid():
                file = request.FILES['file']
                success, message = handle_uploaded_Category_file(file)
                
                if success:
                    messages.success(request, message)
                else:
                    messages.error(request, message)
    
            else:
                messages.error(request, 'File not recognized')

    context = {
        'indicators' : indicator_list,
        'category' : category,
        'form' : form,
        'add_indicator' : add_indicator,
        'formFile' : formFile
    }
    return render(request, 'user-admin/indicators.html', context)

@login_required(login_url='login')
@admin_user_required
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

@login_required(login_url='login')
@admin_user_required
def delete_indicator(request,pk):
    
    indicator = Indicator.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')


    #Parent Indicator 
    indicator.is_deleted = True
    indicator.save()

    
    indicator_list = Indicator.objects.all()


    #Check Child of Child 
    def check_child(parent_obj):
        for indicator_obj in indicator_list:
            if indicator_obj.parent == parent_obj:
                indicator_obj.is_deleted = True
                indicator_obj.save()
                check_child(indicator_obj)




    for indicator_obj in indicator_list:
        if indicator_obj.parent == indicator:
            indicator_obj.is_deleted = True
            indicator_obj.save()
            check_child(indicator_obj)


    #Parent Related Values 
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

       

@login_required(login_url='login')
@admin_user_required
def measurement(request):
    addMeasurementForm = MeasurementForm()
    editMeasurementForm = MeasurementForm()
    if request.method == 'POST':
        if 'formAddMeasurement' in request.POST:
            addMeasurementForm = MeasurementForm(request.POST)
            if addMeasurementForm.is_valid():
                try:
                   new_measurement = addMeasurementForm.save(commit=False)
                   parent_id = request.POST.get('addNewMeasurement')
                   parent = Measurement.objects.get(pk = parent_id)
                   new_measurement.parent = parent
                   new_measurement.save()
                   addMeasurementForm = MeasurementForm()
                   messages.success(request, 'Successfully New measurement Added!')
                except:
                    messages.error(request, 'Please Try Again!')
        if 'form_measurement_edit' in request.POST:
            editMeasurementForm = MeasurementForm(request.POST)
            if editMeasurementForm.is_valid():
                measurement_id = request.POST.get('id_measurement')
                measurement_obj = Measurement.objects.get(pk = measurement_id)
                measurement_obj.Amount_AMH = editMeasurementForm.cleaned_data['Amount_AMH']
                measurement_obj.Amount_ENG = editMeasurementForm.cleaned_data['Amount_ENG']
                measurement_obj.save()
                editMeasurementForm = MeasurementForm()
                messages.success(request, 'Successfully Updated')
            else:
                messages.error(request, 'Please Try Again!')

                
    context = {
        'addMeasurementForm' : addMeasurementForm,
        'editMeasurementForm' : editMeasurementForm
    }
    return render(request, 'user-admin/measurement.html', context)

@login_required(login_url='login')
@admin_user_required
def delete_measurement(request, pk):
    try:
        measurement = Measurement.objects.get(pk = pk)
        previous_page = request.META.get('HTTP_REFERER')
        measurement.is_deleted = True
        measurement.save()
    
        messages.success(request, "Successfully Removed")
        return HttpResponseRedirect(previous_page)
    except: 
        messages.error(request, 'Please Try Again!')


#Source
@login_required(login_url='login')
@admin_user_required
def source(request, source_id=None):
    sources = Source.objects.all()

    if request.method == 'POST':
        if 'source_id' in request.POST:
            # Editing an existing source
            source_instance = get_object_or_404(Source, id=request.POST['source_id'])
            form = SourceForm(request.POST, instance=source_instance)
        else:
            # Adding a new source
            form = SourceForm(request.POST)

        if form.is_valid():
            form.save()
            if 'source_id' in request.POST:
                messages.success(request, "Source has been successfully updated!")
            else:
                messages.success(request, "Source has been successfully added!")
            return redirect('user-admin-source')
        else:
            messages.error(request, "Value exists or please try again!")

    else:
        # GET request or form is not valid, display the form
        if source_id:
            # Editing an existing source, populate the form with existing data
            source_instance = get_object_or_404(Source, id=source_id)
            form = SourceForm(instance=source_instance)
        else:
            # Adding a new source
            form = SourceForm()

    context = {
        'form': form,
        'sources': sources
    }
    return render(request, 'user-admin/source.html', context=context)



@login_required(login_url='login')
@admin_user_required
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

@login_required(login_url='login')
@admin_user_required
def delete_source(request,pk):
    source = Source.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')
    
    # Soft delete the category
    source.is_deleted = True
    source.save()

    # Optionally, you can soft delete related objects here if needed
    
    messages.success(request, "Successfully Deleted!")
    return HttpResponseRedirect(previous_page)

@login_required(login_url='login')
@admin_user_required
def topic(request, topic_id=None):
    topics = Topic.objects.filter(is_deleted = False)

    # If topic_id is provided, it's an update operation
    if topic_id:
        topic_instance = get_object_or_404(Topic, pk=topic_id)
    else:
        # If it's not an update operation, check if the topic_Id is present in the POST data
        topic_instance = None
        topic_id_from_post = request.POST.get('topic_Id')
        if topic_id_from_post:
            topic_instance = get_object_or_404(Topic, id=topic_id_from_post)

    # Initialize form with or without data
    form = TopicForm(instance=topic_instance)
    formFile = ImportFileForm()

    if request.method == 'POST':
        if 'topicFormValue' in request.POST:
            form = TopicForm(request.POST, instance=topic_instance)
            if form.is_valid():
                obj = form.save(commit=False)
                is_new_topic = obj.pk is None
                obj.save()
    
                success_message = "Topic has been successfully added!" if is_new_topic else "Topic has been successfully updated!"
                messages.success(request, success_message)
    
                return redirect('user-admin-topic')
            else:
                messages.error(request, "Value exists or please try again!")
        
        if 'fileTopicValue' in request.POST:
            formFile = ImportFileForm(request.POST, request.FILES )
            if formFile.is_valid():
                file = request.FILES['file']
                success, message = handle_uploaded_Topic_file(file)
                
                if success:
                    messages.success(request, message)
                else:
                    messages.error(request, message)
    
            else:
                messages.error(request, 'File not recognized')
    else:
        form = TopicForm()
        formFile = ImportFileForm(request.POST or None, request.FILES or None)
    



            

    context = {'form': form, 'topics': topics, 'topic_id': topic_id, 'formFile' : formFile}
    return render(request, 'user-admin/topic.html', context=context)


@login_required(login_url='login')
def json_filter_topic(request):
    topics = Topic.objects.all()
    
    # Creating a list of dictionaries representing each topic
    topics_data = []
    for topic in topics:
        topics_data.append({
            'id': topic.id,
            'title_ENG': topic.title_ENG,
            'title_AMH': topic.title_AMH,
            'updated': topic.updated.isoformat(),
            'created': topic.created.isoformat(),
            'is_deleted': topic.is_deleted,
        })

    # Returning the list as JSON
    return JsonResponse({'topics': topics_data})

@login_required(login_url='login')
@admin_user_required
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

@login_required(login_url='login')
@admin_user_required
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
@login_required(login_url='login')
@admin_user_required
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
       
@login_required(login_url='login')
@admin_user_required
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

@login_required(login_url='login')
@admin_user_required
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
@login_required(login_url='login')
@admin_user_required
def month(request):
    months = Month.objects.all()
    context = {
        'months' : months,
    }
    return render(request, 'user-admin/month.html', context )


@login_required(login_url='login')
@admin_user_required
def trash_topic(request):
    if request.method == 'POST':
        topic_id = request.POST.get('topic_id')
        if topic_id:
            topic = get_object_or_404(Topic, pk=topic_id)
            topic.is_deleted = False
            topic.save()
            messages.success(request, 'Topic restored successfully.')
            return redirect('trash-topic')
        else:
            messages.error(request, 'Failed to restore topic.')

    recycled_topics = Topic.objects.filter(is_deleted=True)
    
    context = {
        'recycled_topics': recycled_topics,
    }
    return render(request, 'user-admin/trash_Topic.html', context)


@login_required(login_url='login')
@admin_user_required
def trash_indicator(request):
    return render(request, 'user-admin/trash_Indicator.html')

@login_required(login_url='login')
@admin_user_required
def trash_category(request):
    if request.method == 'POST':
        catagory_Id = request.POST.get('catagory_Id')
        if catagory_Id:
            category = get_object_or_404(Source, pk=catagory_Id)
            category.is_deleted = False
            category.save()
            messages.success(request, 'Source restored successfully.')
            return redirect('trash-source')
        else:
            messages.error(request, 'Failed to restore Source.')

    recycled_categories = Category.objects.filter(is_deleted=True)
    context = {
        'recycled_categories': recycled_categories,
    }
    return render(request, 'user-admin/trash_Category.html', context)


@login_required(login_url='login')
@admin_user_required
def trash_source(request):
    if request.method == 'POST':
        source_id = request.POST.get('source_id')
        if source_id:
            source = get_object_or_404(Source, pk=source_id)
            source.is_deleted = False
            source.save()
            messages.success(request, 'Source restored successfully.')
            return redirect('trash-source')
        else:
            messages.error(request, 'Failed to restore Source.')

    recycled_sources = Source.objects.filter(is_deleted=True)
    context = {
        'recycled_sources': recycled_sources,
    }
    return render(request, 'user-admin/trash_Source.html', context)


@login_required(login_url='login')
@admin_user_required
def restore_item(request, item_type, item_id):
    previous_page = request.META.get('HTTP_REFERER')
    model_mapping = {
        'topic': Topic,
        'indicator': Indicator,
        'catagory': Category,
        'source': Source,
    }

    model = model_mapping.get(item_type)
    if not model:  
        messages.error(request,'Failed to restore item')
        return HttpResponseRedirect(previous_page) # Change to the actual view name for recycled items


    item = get_object_or_404(model, pk=item_id)
    item.is_deleted = False
    item.save()

    messages.success(request,'Successfully restored')

    # Redirect to the view where the recycled items are displayed
    return redirect('user-admin-recyclebin') 

@login_required
@admin_user_required
def restore_indicator(request, pk):
    indicator = Indicator.objects.get(pk=pk)
    previous_page = request.META.get('HTTP_REFERER')

    #Parent Indicator 
    indicator.is_deleted = False
    indicator.save()

    indicator_list = Indicator.objects.all()


    #Check Child of Child 
    def check_child(parent_obj):
        for indicator_obj in indicator_list:
            if indicator_obj.parent == parent_obj:
                indicator_obj.is_deleted = False
                indicator_obj.save()
                check_child(indicator_obj)
    

    for indicator_obj in indicator_list:
        if indicator_obj.parent == indicator:
            indicator_obj.is_deleted = False
            indicator_obj.save()
            check_child(indicator_obj)


    #Parent Related Values 
    years = DataPoint.objects.all()
    for year in  years:
        try: 
           deleted_indicator = DataValue.objects.get(for_datapoint = year, for_indicator = indicator)
           deleted_indicator.is_deleted = False
           deleted_indicator.save()
        except:
            None



    messages.success(request, "Successfully Restored!")
    return HttpResponseRedirect(previous_page)

def month_data(request, month_id):
    indicator = Indicator.objects.get(pk=month_id)
    months = Month.objects.all()
    years = DataPoint.objects.all()

    child_indicator = Indicator.objects.filter(parent=indicator)

    data_set = []

    if indicator.type_of == 'monthly':
        for child in child_indicator:
            arr = []
            for year in years:
                for month in months:
                    value_child = DataValue.objects.filter(for_indicator=child, for_month=month, for_datapoint=year, is_deleted=False).first()
                    if value_child is not None:
                        date = datetime(int(value_child.for_datapoint.year_EC), int(value_child.for_month.number), 1)
                        val = [[int(value_child.for_datapoint.year_EC), int(value_child.for_month.number), 1], value_child.value]
                        arr.append(val)
            data_set.append({'name': child.title_ENG, 'data': arr})
            
    # Return JSON response
    return JsonResponse(data_set, safe=False)


def quarter_data(request, quarter_id):
    indicator = Indicator.objects.get(pk=quarter_id)
    quarters = Quarter.objects.all()
    years = DataPoint.objects.all()

    child_indicator = Indicator.objects.filter(parent=indicator)

    data_set = []

    if indicator.type_of == 'quarterly':
        for child in child_indicator:
            arr = []
            for year in years:
                for quarter in quarters:
                    value_child = DataValue.objects.filter(
                        for_indicator=child,
                        for_quarter=quarter,
                        for_datapoint=year,
                        is_deleted=False
                    ).first()

                    if value_child is not None and value_child.value is not None:
                        # Map the quarter to perspective months
                        quarter_to_month = {'Q1': 1, 'Q2': 3, 'Q3': 6, 'Q4': 9}
                        start_month = quarter_to_month[quarter.title_ENG]
                        start_date = 1  # You may adjust this as needed

                        val = [
                            [
                                int(value_child.for_datapoint.year_EC),
                                start_month,
                                start_date
                            ],
                            value_child.value
                        ]
                        arr.append(val)

            # Append data only if there is non-empty and non-null data
            if arr:
                data_set.append({'name': child.title_ENG, 'data': arr})

    # Return JSON response
    return JsonResponse(data_set, safe=False)








