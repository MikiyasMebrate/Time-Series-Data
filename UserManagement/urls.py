from django.conf.urls.static import static
from django.conf import settings
from . import urls

from django import views
from django.urls import path
from UserManagement import views
from .views import *
from django.contrib.auth import views as auth_views


urlpatterns = [
    #Profile  
    path('admin-profile/', views.admin_profile, name="user-admin-profile"),
<<<<<<< HEAD
=======
    path('staff-profile/', views.staff_profile,name='staff-profile'),
>>>>>>> 6d433e7 (user page updated)

    #Password 
    path('admin-setting/', views.admin_change_password, name='user-admin-change-password'),
    path('staff-setting/', views.staff_change_password,  name='staff-change-password'),
    
    #User Operation 
<<<<<<< HEAD
    path('admin-update-profile/', views.admin_profile_updated, name='admin-update-profile'),
    path('staff-update-profile/', views.staff_profile_updated, name='staff-update-profile'),
=======
    path('admin-update-profile/<int:pk>/', views.admin_profile_updated, name='admin-update-profile'),
    path('staff-update-profile/<int:pk>/', views.staff_profile_updated, name='staff-update-profile'),
>>>>>>> 6d433e7 (user page updated)


    path('users/', views.users_list, name="user-admin-user-list"),
    path('activate_deactivate_user/<int:user_id>/', views.activate_deactivate_user, name='activate_deactivate_user'),
    path('users/<int:user_id>/edit/', views.edit_user, name='edit_user'),   

]
     