from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views
from TimeSeriesBase import views
from UserManagement import views
# from django.conf import settings
# from django.conf.urls.static import static
urlpatterns = [
    path('',index,name="index"),
    path('index/',index,name="user_index"),
    path('about/',about,name="about"),
    path('contact/',contact,name="contact"),
    path('data/',data,name="data"),
    path('profile', MyView.as_view(template_name='profile.html'), name = 'profile'),
    path('change_password', PasswordChangeView.as_view(template_name='password_change.html'), name = 'change_password'),
    path('setting', UserEditView.as_view(template_name='setting.html'), name = 'setting'),
    path('login/',views.login_view,name="login"),
    path('logout/',views.logout_view,name="logout"),
    
]
