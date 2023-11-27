from django.conf.urls.static import static
from django.conf import settings
# from .views import user_registration_view,users_list,login_view,delete_user
# update_user,edit_user,delete_user
from . import urls

from django import views
from django.urls import path
from . import views

urlpatterns = [
     
    path('profile/', views.user_registration_view, name="user-admin-profile"),
    path('update-user/<int:pk>/', views.update_user, name='update-user'),
    path('users/', views.users_list, name="user-admin-user-list"),
    
    path('users/<int:user_id>/edit/', views.edit_user, name='edit_user'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
     
   

   #path('user-registration/', views.user_registration, name='user-registration'),
   #path('users_list/', views.users_list, name='users_list'),
    
]
     
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)