from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views

from UserManagement import views



urlpatterns = [
    path('',index,name="index"),
    path('index/',index,name="user_index"),
    path("detail-analysis/<int:pk>", detail_analysis , name="detail-analysis"),
    path('about/',about,name="about"),
    path('contact/',contact,name="contact"),
    path('data/',data,name="data"),
    path('profile/', profile_view, name = 'staff-profile'),
    path('login/',views.login_view,name="login"),
    path('logout/',views.logout_view,name="logout"),
    ###JSON###
    path('user-json/', json, name="user-json"),
    path('user-list-view-category/<int:pk>', filter_category_lists, name='user-list-view-category'),
    path('user-list-view-indicator/<int:pk>', filter_indicator_lists, name="user-list-view-indicator"),
    path('user-json-indicator-value/<int:pk>',filter_indicator_value, name='json-indicator-value'),
    path('user-json-indicator/<int:pk>/', filter_indicator, name='user-json_indicator'),

]
