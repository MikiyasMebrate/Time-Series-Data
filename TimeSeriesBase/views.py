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
    Category_value = Indicator.objects.order_by('-created_at')[:4] # Replace your_attribute with the actual attribute name
    
    # Generate random data based on the attribute
    random_data = {
        'Category_value': Category_value,
    }
    return render(request,"index.html",random_data)


# def generate_random_data(request):
#     # Retrieve the attribute from the model
#     Category_value = Category.objects.all()[:4] # Replace your_attribute with the actual attribute name
#     attribute_value = Indicator.objects.filter().title_ENG
#     # Generate random data based on the attribute
#     random_data = {
#         'Category_value': Category_value,
#         'attribute_value': random.choice(attribute_value),
#         'random_number': random.randint(1, 100),
#         'random_string': ''.join(random.choice('abcdefghijklmnopqrstuvwxyz') for i in range(10))
#     }
#     return JsonResponse(random_data)

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