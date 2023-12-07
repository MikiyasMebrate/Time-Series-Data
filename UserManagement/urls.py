from django.conf.urls.static import static
from django.conf import settings
# from .views import user_registration_view,users_list,login_view,delete_user
# update_user,edit_user,delete_user
from . import urls

from django import views
from django.urls import path
from UserManagement import views
from .views import *
from django.contrib.auth import views as auth_views


urlpatterns = [
     
    path('profile/', views.user_registration_view, name="user-admin-profile"),
    path('setting/', views.admin_change_password, name='user-admin-change-password'),
    path('update-user/<int:pk>/', views.update_user, name='update-user'),
    path('users/', views.users_list, name="user-admin-user-list"),

    path('activate_deactivate_user/<int:user_id>/', views.activate_deactivate_user, name='activate_deactivate_user'),
    path('users/<int:user_id>/edit/', views.edit_user, name='edit_user'),    
]
     
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)