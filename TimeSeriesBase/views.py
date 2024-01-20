from django.shortcuts import render
from django. contrib import messages
from django.contrib.auth.decorators import login_required
from UserManagement.decorators import staff_user_required
from TimeSeriesBase.models import *
import json
import random
from django.http import JsonResponse

@login_required(login_url='login')
@staff_user_required
def index(request):
    last_year =DataPoint.objects.filter().order_by('-year_EC')[1]
    last_last_year = DataPoint.objects.filter().order_by('-year_EC')[2]

    print('--->',last_last_year)
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

    print(cpi_value)
    
    context = {
        'cpi' : cpi_value,
        'year' : last_year
    }
    return render(request,"index.html", context=context)

@login_required(login_url='login')
@staff_user_required
def detail_analysis(request, pk):
    return render(request, 'detail_analysis.html')



@login_required(login_url='login')
@staff_user_required
def about(request):
    return render(request,"about.html")


@login_required(login_url='login')
@staff_user_required
def contact(request):
    return render(request,"contact.html")



@login_required(login_url='login')
@staff_user_required
def profile_view(request):
    return render(request,"profile.html")


@login_required(login_url='login')
@staff_user_required
def data(request):
    return render(request,"data.html")