from django.shortcuts import render
from django. contrib import messages
from django.contrib.auth.decorators import login_required
from UserManagement.decorators import staff_user_required
from TimeSeriesBase.models import *
import json
import random
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from django.forms.models import model_to_dict


def index(request):
    # Create a thread for the background task
    stop_event = threading.Event()
    background_thread = threading.Thread(target=background_task, args=("Example", stop_event), daemon=True)
    # Start the background thread
    background_thread.start()
    stop_event.set()
    
    
    

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



def detail_analysis(request, pk):
    return render(request, 'detail_analysis.html')


def about(request):
    return render(request,"about.html")


def contact(request):
    return render(request,"contact.html")



@login_required(login_url='login')
@staff_user_required
def profile_view(request):
    return render(request,"profile.html")


def data(request):
    return render(request,"data.html")



##############################
#          JSON             #
#############################




def json(request):
    topic = list(Topic.objects.all().values())
    year =list( DataPoint.objects.all().values())
    month = list(Month.objects.all().values())
    quarter = list(Quarter.objects.all().values())

    context = {
        'topics': topic,
        'year' : year,
        'quarter' : quarter,
        'month' : month,

    }
    return JsonResponse(context)

def filter_category_lists(request,pk):
    topic = Topic.objects.get(pk = pk)
    category_lists = list(Category.objects.filter(topic = topic).prefetch_related('topic').values())
    return JsonResponse(category_lists, safe=False)


def filter_indicator_lists(request, pk):
    category = Category.objects.get(pk = pk)
    if isinstance(request.user, AnonymousUser):
        indicators = list(Indicator.objects.filter(for_category = category, is_public = True).select_related("for_category").values())
    else:
        indicators = list(Indicator.objects.filter(for_category = category).select_related("for_category").values())
    return JsonResponse(indicators, safe=False)
   


def filter_indicator_value(request, pk):
    single_category = Category.objects.get(pk = pk)
    parent_indicators = Indicator.objects.filter(for_category = single_category, parent = None).select_related("for_category")
    indicator_list = []


    def child_indicators(parent):
        child_indicator = Indicator.objects.filter(parent = parent).select_related("for_category")
        if child_indicator:
            for indicator in child_indicator:
                indicator_list.append(model_to_dict(indicator))
                child_indicators(indicator)
        
    for parent_indicator in parent_indicators:
        indicator_list.append(model_to_dict(parent_indicator))
        child_indicators(parent_indicator)

    value_new = []
    for indicator in indicator_list:
        for yr in DataPoint.objects.all():
           try: value_filter = list(DataValue.objects.filter(for_datapoint = yr, for_indicator__id = indicator['id']).select_related("for_datapoint", "for_indicator").values())
           except: value_filter = None
           if value_filter:
                for val in value_filter:
                    value_new.append(val)
    return JsonResponse(value_new, safe=False)