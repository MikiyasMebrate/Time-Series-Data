from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views

from UserManagement import views



urlpatterns = [
    path('',index,name="index"),
    path('index/',index,name="user_index"),
    path('about/',about,name="about"),
    path('contact/',contact,name="contact"),
    path('data/',data,name="data"),
    path('profile/', profile_view, name = 'staff-profile'),
    path('login/',views.login_view,name="login"),
    path('logout/',views.logout_view,name="logout"),
    
]
