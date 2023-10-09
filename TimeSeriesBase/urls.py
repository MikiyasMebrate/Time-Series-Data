from django.urls import path
from .views import *

urlpatterns = [
    path('index/',index,name="index"),
    path('about/',about,name="about"),
    path('contact/',contact,name="contact"),
    path('profile/',profile,name="profile"),
    
]
