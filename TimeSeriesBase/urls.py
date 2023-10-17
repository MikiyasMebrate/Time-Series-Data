from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views
from TimeSeriesBase import views
urlpatterns = [
    path('',index,name="index"),
    path('about/',about,name="about"),
    path('contact/',contact,name="contact"),
    path('data/',data,name="data"),
    path('profile/',profile,name="profile"),
    path('change_password', PasswordChangeView.as_view(template_name='password_change.html'), name = 'change_password'),
     path('setting', UserEditView.as_view(template_name='setting.html'), name = 'setting'),
    # path('setting',setting,name="setting"),
    path('login/',login,name="login"),
    
]
