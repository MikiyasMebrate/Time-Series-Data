from django.urls import path
from .views import *

urlpatterns = [
    path('',index,name="index"),
    path('about/',about,name="about"),
    path('contact/',contact,name="contact"),
    path('data/',data,name="data"),
    path('profile/',profile,name="profile"),
    path('login/',login,name="login"),
    
]
