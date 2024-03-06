from django.shortcuts import render
from django. contrib import messages
from django.contrib.auth.decorators import login_required
from UserManagement.decorators import staff_user_required
from TimeSeriesBase.models import *
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from django.forms.models import model_to_dict
from .decorators import public_required
from django.db.models import F
from django.shortcuts import get_object_or_404


@public_required
def index(request):
    last_year =DataPoint.objects.filter().order_by('-year_EC')[1]
    last_last_year = DataPoint.objects.filter().order_by('-year_EC')[2]

    #CPI
    cpi_category = Category.objects.filter(name_ENG = 'CPI').first()
    cpi_indicators = Indicator.objects.filter(for_category = cpi_category)

    cpi_value = []
    for item in cpi_indicators:
        value_last_year = DataValue.objects.filter(for_datapoint = last_year, for_indicator = item)
        value_last_last_year = DataValue.objects.filter(for_datapoint = last_last_year, for_indicator = item)
        
        if value_last_year and value_last_last_year:
            sum1 = 0
            for val in value_last_year:
                sum1 = sum1 + val.value

            sum2 = 0
            for val in value_last_last_year:
                sum2 = sum2 + val.value

            percentage = ((sum1 - sum2) / sum2) * 100
            
            cpi_value.append({'item' : item.title_ENG ,'value' : round(-1 * percentage if percentage < 0 else percentage, 1), 'link' : item.id, 'mode' : 'negative' if percentage < 0 else 'positive'})

    
    #Export Bill  USD
    export_bill_category = Category.objects.filter(name_ENG = 'Export in Bil USD').first()
    export_bill_indicators = Indicator.objects.filter(for_category = export_bill_category)

    export_bill_value = []
    for item in export_bill_indicators:
        value_last_year = DataValue.objects.filter(for_datapoint = last_year, for_indicator = item).first()
        value_last_last_year = DataValue.objects.filter(for_datapoint = last_last_year, for_indicator = item).first()
        percentage = ((value_last_year.value - value_last_last_year.value) / value_last_last_year.value) * 100
        export_bill_value.append({'item' : item.title_ENG ,'value' : round(-1 * percentage if percentage < 0 else percentage, 1), 'link' : item.id, 'mode' : 'negative' if percentage < 0 else 'positive'})
    

    #GDP
        
        
    
    context = {
        'cpi' : cpi_value,
        'cpi_category' : cpi_category,
        'year' : last_year,
        'export_bill_value' : export_bill_value,
        'export_bill_category' : export_bill_category
    }
    return render(request,"index.html", context=context)

@public_required
def detail_analysis(request, pk):
    return render(request, 'detail_analysis.html')

@public_required
def about(request):
    return render(request,"about.html")

@public_required
def contact(request):
    return render(request,"contact.html")


@staff_user_required
def profile_view(request):
    return render(request,"profile.html")

@public_required
def data(request):
    return render(request,"data.html")


##############################
#          JSON             #
#############################

@public_required
def json(request):
    topic = list(Topic.objects.all().values())
    year =list( DataPoint.objects.all().values())
    month_data = cache.get("month_data")
    quarter_data = cache.get("quarter_data")

    if month_data is None:
        # Fetch month data from the database if not in cache
        month_data = list(Month.objects.all().values())
        # Cache the data for future requests
        cache.set("month_data", month_data)

    if quarter_data is None:
        # Fetch quarter data from the database if not in cache
        quarter_data = list(Quarter.objects.all().values())
        # Cache the data for future requests
        cache.set("quarter_data", quarter_data)
        

    context = {
        'topics': topic,
        'year' : year,
        'quarter' : quarter_data,
        'month' : month_data,

    }
    return JsonResponse(context)


@public_required
def filter_category_lists(request,pk):
    topic = Topic.objects.get(pk = pk)
    category_lists = list(Category.objects.filter(topic = topic).prefetch_related('topic').values())
    return JsonResponse(category_lists, safe=False)


@public_required
def filter_indicator_lists(request, pk):
    category = Category.objects.get(pk = pk)
    if isinstance(request.user, AnonymousUser):
        indicators = Indicator.objects.filter(for_category = category, is_public = True).select_related("for_category")
    else:
        indicators = Indicator.objects.filter(for_category = category).select_related("for_category")

    def child_indicator_filter(parent):
        return Indicator.objects.filter(parent = parent)

    returned_json = []

    def child_list(parent, child_lists):
        for i in child_lists:
            if i.parent == parent:
                child_lists = child_indicator_filter(i)
                returned_json.extend(list(child_lists.values('id', 'title_ENG', 'title_AMH', 'composite_key', 'op_type', 'parent_id', 'for_category_id', 'is_deleted', 'measurement_id', 'measurement__Amount_ENG', 'type_of', 'is_public')))
                child_list(i,child_lists)

    returned_json.extend(list(indicators.values('id', 'title_ENG', 'title_AMH', 'composite_key', 'op_type', 'parent_id', 'for_category_id', 'is_deleted', 'measurement_id', 'measurement__Amount_ENG', 'type_of', 'is_public')))             
    for indicator in indicators:
        child_lists = child_indicator_filter(indicator)
        returned_json.extend(list(child_lists.values('id', 'title_ENG', 'title_AMH', 'composite_key', 'op_type', 'parent_id', 'for_category_id', 'is_deleted', 'measurement_id', 'measurement__Amount_ENG', 'type_of', 'is_public'))) 
        child_list(indicator, child_lists)

    #  "id": 1033,
    #     "title_ENG": "TOTAL OUTSTANDING(USD)",
    #     "title_AMH": "",
    #     "composite_key": "TOTALOUTSTANDING1033",
    #     "op_type": "sum",
    #     "parent_id": null,
    #     "created_at": "2024-01-24T06:20:36.775Z",
    #     "for_category_id": 21,
    #     "is_deleted": false,
    #     "measurement_id": 4,
    #     "type_of": "yearly",
    #     "is_public": true
    # },
    return JsonResponse(returned_json, safe=False)
   



@public_required
def filter_indicator_value(request, pk):
    # Use get_object_or_404 to handle the case where the category with the specified primary key does not exist
    single_category = get_object_or_404(Category, pk=pk)

    # Fetch all indicators related to the category using select_related to minimize queries
    parent_indicators = Indicator.objects.filter(for_category=single_category, parent=None).select_related("for_category")

    # Prefetch child indicators to minimize additional queries inside loops
    indicators_with_children = Indicator.objects.filter(parent__in=parent_indicators).prefetch_related("children")

    # Create a dictionary for each parent and child indicator
    indicator_list = [model_to_dict(parent_indicator) for parent_indicator in parent_indicators]
    indicator_list += [model_to_dict(child_indicator) for child_indicator in indicators_with_children]

    value_new = []

    # Fetch data values for each indicator in a single query
    for indicator in indicator_list:
        value_filter = DataValue.objects.filter(for_indicator__id=indicator['id']).select_related("for_datapoint", "for_indicator").values()

        for val in value_filter:
            value_new.append(val)
    return JsonResponse(value_new, safe=False)

from django.core.cache import cache
##INDEX SAMPLE DATA 
#Indicator Detail Page With Child and with Values

@public_required
def filter_indicator(request, pk):
    single_indicator = Indicator.objects.get(pk = pk)


    returned_json = []
    returned_json.append(model_to_dict(single_indicator))


    indicators = list(Indicator.objects.all().values())

    year = list(DataPoint.objects.all().values())
    
    indicator_point = list(Indicator_Point.objects.filter(for_indicator = pk).values())
    measurements = list(Measurement.objects.all().values())
    # Attempt to get data from cache
    month_data = cache.get("month_data")
    quarter_data = cache.get("quarter_data")

    if month_data is None:
        # Fetch month data from the database if not in cache
        month_data = list(Month.objects.all().values())
        # Cache the data for future requests
        cache.set("month_data", month_data)

    if quarter_data is None:
        # Fetch quarter data from the database if not in cache
        quarter_data = list(Quarter.objects.all().values())
        # Cache the data for future requests
        cache.set("quarter_data", quarter_data)
    indicators_with_children = Indicator.objects.filter(parent=single_indicator).prefetch_related("children")

    # Create a dictionary for each parent and child indicator
    indicator_list = [model_to_dict(single_indicator)]
    indicator_list  += [model_to_dict(child_indicator) for child_indicator in indicators_with_children]

    def child_list(parent):
        for i in indicators:
            if i['parent_id'] == parent.id:
                returned_json.append(i)
                child_list(Indicator.objects.get(id = i['id']))
                    
    
    child_list(single_indicator)

    value_new = []
    year_new = []


    # Fetch data values for each indicator in a single query
    for indicator in indicator_list:
    # Fetch DataValues and related DataPoint instances in a single query
        value_filter = DataValue.objects.filter(for_indicator__id=indicator['id']).select_related("for_datapoint", "for_indicator")
    
        for data_value in value_filter:
            for_datapoint_instance = data_value.for_datapoint
    
            # Check if the DataPoint instance is in year_new before appending
            if model_to_dict(for_datapoint_instance) not in year_new:
                year_new.append(model_to_dict(for_datapoint_instance))
    
            # Convert DataValue and DataPoint instances to dictionaries and append to value_new
            value_new.append({
                'id': data_value.id,
                'value': data_value.value,
                'for_quarter_id': data_value.for_quarter_id,
                'for_month_id': data_value.for_month_id,
                'for_datapoint_id': data_value.for_datapoint_id,
                'for_datapoint__year_EC': for_datapoint_instance.year_EC,
                'for_source_id': data_value.for_source_id,
                'for_indicator_id': data_value.for_indicator_id,
                'is_deleted': data_value.is_deleted
            })   
    
    context = {
        'indicators' :  returned_json,
        'indicator_point': indicator_point,
        'year' : year,
        'new_year' : year_new,
        'value' : value_new,
        'measurements' : measurements,
        'month': month_data,
        'quarter': quarter_data
    }
    
    return JsonResponse(context)

@public_required
def month_data(request, month_id):
    category = Category.objects.get(pk=month_id)
    child_indicators = Indicator.objects.filter(for_category=category)

    months = Month.objects.all()
    years = DataPoint.objects.all()

    data_set = []

    for child in child_indicators:
        values = DataValue.objects.filter(
            for_indicator=child,
            for_month__in=months,
            for_datapoint__in=years,
            is_deleted=False
        ).values('for_datapoint__year_EC', 'for_month__number', 'value')

        arr = [
            [
                [int(value['for_datapoint__year_EC']), int(value['for_month__number']), 1],
                value['value']
            ]
            for value in sorted(values, key=lambda x: (x['for_datapoint__year_EC'], x['for_month__number']))
        ]

        data_set.append({'name': child.title_ENG, 'data': arr})

    return JsonResponse(data_set, safe=False)

from django.db.models import F

@public_required
def quarter_data(request, quarter_id):
    category = Category.objects.get(pk=quarter_id)
    child_indicators = Indicator.objects.filter(for_category=category)

    data_set = []

    for child in child_indicators:
        values = DataValue.objects.filter(
            for_indicator=child,
            is_deleted=False
        ).values('for_datapoint__year_EC', 'for_quarter__title_ENG', 'value')

        quarters = set(value['for_quarter__title_ENG'] for value in values)
        years = sorted(set(value['for_datapoint__year_EC'] for value in values))

        arr = [
            [
                [
                    int(value['for_datapoint__year_EC']),
                    quarter_to_month(value['for_quarter__title_ENG']),
                    1
                ],
                value['value']
            ]
            for value in sorted(values, key=lambda x: (x['for_datapoint__year_EC'], quarter_to_month(x['for_quarter__title_ENG'])))
            if value['value'] is not None
        ]

        # Append data only if there is non-empty data
        if arr:
            data_set.append({'name': child.title_ENG, 'data': arr})

    return JsonResponse(data_set, safe=False)

@public_required
def quarter_to_month(quarter_title):
    # Map the quarter to perspective months
    quarter_to_month = {'Q1': 1, 'Q2': 4, 'Q3': 7, 'Q4': 10}
    return quarter_to_month.get(quarter_title, 1)

