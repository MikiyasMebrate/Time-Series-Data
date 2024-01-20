from django.urls import path
from . import views
from UserAdmin import views
urlpatterns = [
    path('', views.index, name="user-admin-index"),
    #Audit 
    path('audit/', views.audit_log_list, name='user-admin-audit'),
    #JSON
    path('json/', views.json,name="json"),
    path('json-indicator-value/<int:pk>',views.filter_indicator_value, name='json-indicator-value'),
    path('json-dashboard/',views.dashboard_json, name='json-dashboard'),
    path('json-indicator/<int:pk>/', views.filter_indicator, name='json_indicator'),
    path('json-filter-indicator/', views.filter_indicator_json, name='json_filter_indicator'),
    path('json-filter-topic/', views.json_filter_topic, name='json_filter_topic'),
    path('json-filter-catagory/', views.filter_catagory_json, name='json_filter_catagory'),
    path('json-filter-source/', views.json_filter_source, name='json_filter_source'),
    path('json-filter-year/', views.json_filter_year, name='json_filter_year'),
    path('json-filter-measurement/', views.json_measurement, name='json_measurement'),
    path('json-filter-random/', views.json_random, name='json_random'),
    path('json-filter-drill/', views.json_filter_drilldown, name='json_drill'),
    # URL for fetching a specific measurement by ID
    path('json-filter-measurement/<int:measurement_id>/', views.json_measurement_byID, name='json_measurement_by_id'),
    path('json-filter-quaarter/<int:quarter_id>/', views.quarter_data, name='json_month_by_id'),

    #Category
    path('category/', views.category, name="user-admin-category"),
    path('category-delete/<int:pk>', views.delete_category, name='user-catagory-delete'),
    
    #Data List
    path('data-list/', views.data_list, name="user-admin-data-list"),
    path('data-list-detail/<int:pk>', views.data_list_detail, name="user-admin-data-list-detail"),
   
   #Indicators
    path('indicators/', views.indicator, name="user-admin-indicators"),
    path('indicators-list/<int:pk>', views.indicator_list, name="user-admin-indicators-list"),
    path('indicator-delete/<int:pk>', views.delete_indicator, name='user-admin-indicator-delete'),
    path('indicator-detail/<int:pk>', views.indicator_detail, name='user-admin-indicator-detail'),
    
   
   #Data-Point
    path('data-point-detail/<int:pk>', views.data_point_detail, name="user-admin-data-point-detail"),
    path('data-point-delete/<int:pk>', views.delete_data_point, name="user-admin-data-point-delete"),
    
    
    #Measurement
    path('measurement/', views.measurement, name="user-admin-measurement"),
    path('measurement-delete/<int:pk>', views.delete_measurement, name="user-admin-delete-measurement"),


    #source
    path('source/', views.source, name="user-admin-source"),
    path('source/<int:pk>', views.source_detail, name="user-source-detail"),
    path('source-delete/<int:pk>', views.delete_source, name='user-source-delete'),

    #year
    path('year/', views.year_add, name="user-admin-year"),


    #topic
    path('topic/', views.topic, name="user-admin-topic"),
    path('topic-delete/<int:pk>', views.delete_topic, name='user-topic-delete'),

    #Trash
    path('restore_item/<str:item_type>/<int:item_id>/', views.restore_item, name='restore_item'),
    path('restore-indicator/<str:pk>/', views.restore_indicator, name='restore-indicator'),
    path('trash-topic/', views.trash_topic, name="trash-topic"),
    path('trash-indicator/', views.trash_indicator, name="trash-indicator"),
    path('trash-category/', views.trash_category,name="trash-category"),
    path('trash-source/', views.trash_source, name='trash-source'),



    #Excel Review
    path('review-topic/', views.import_preview, name='data-preview-topic')
]
    
