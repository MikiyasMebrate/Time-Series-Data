from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="user-admin-index"),
    
    #JSON
    path('json/', views.json,name="json"),
    path('json-indicator/<int:pk>/', views.filter_indicator, name='json_indicator'),
    path('json-filter-indicator/', views.filter_indicator_json, name='json_filter_indicator'),
    
    #Category
    path('category/', views.category, name="user-admin-category"),
    path('category/<int:pk>', views.catagory_detail, name="user-catagory-detail"),
    path('category-delete/<int:pk>', views.delete_category, name='user-catagory-delete'),
    
    #Data List
    path('data-list/', views.data_list, name="user-admin-data-list"),
    path('data-list-detail/<int:pk>', views.data_list_detail, name="user-admin-data-list-detail"),
   
   #Indicators
    path('indicators/', views.indicator, name="user-admin-indicators"),
    path('indicators-list/<int:pk>', views.indicator_list, name="user-admin-indicators-list"),
    path('indicator-delete/<int:pk>', views.delete_indicator, name='user-admin-indicator-delete'),
    path('indicator-detail/<int:pk>', views.indicator_detail, name='user-admin-indicator-detail'),
    
    #Location
    path('location/', views.location, name="user-admin-location"),
    path('location/<int:pk>', views.location_detail, name="user-location-detail"),
    path('location-delete/<int:pk>', views.delete_location, name='user-location-delete'),
   
   #Data-Point
    path('data-point/', views.data_point, name="user-admin-data-point"),
    path('data-point-detail/<int:pk>', views.data_point_detail, name="user-admin-data-point-detail"),
    path('data-point-delete/<int:pk>', views.delete_data_point, name="user-admin-data-point-delete"),
    
   #Month
   path('month/', views.month, name="user-admin-month"),
    
    path('measurement/', views.measurement, name="user-admin-measurement"),
    path('profile/', views.profile, name="user-admin-profile"),
    path('source/', views.source, name="user-admin-source"),
    path('source/<int:pk>', views.source_detail, name="user-source-detail"),
    path('source-delete/<int:pk>', views.delete_source, name='user-source-delete'),
    path('topic/', views.topic, name="user-admin-topic"),
    path('topic/<int:pk>', views.topic_detail, name="user-topic-detail"),
    path('topic-delete/<int:pk>', views.delete_topic, name='user-topic-delete'),
    
    path('recyclebin/', views.recyclebin, name="user-admin-recyclebin"),
    path('users/', views.users_list, name="user-admin-user-list")
]
