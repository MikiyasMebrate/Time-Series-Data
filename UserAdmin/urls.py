from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="user-admin-index"),
    path('category/', views.category, name="user-admin-category"),
    path('data-list/', views.data_list, name="user-admin-data-list"),
    path('data-list-detail/', views.data_list_detail, name="user-admin-data-list-detail"),
    path('indicators/', views.indicator, name="user-admin-indicators"),
    path('location/', views.location, name="user-admin-location"),
    path('location/<int:pk>', views.location_detail, name="user-location-detail"),
    path('location-delete/<int:pk>', views.delete_location, name='user-location-delete'),
    path('measurement/', views.measurement, name="user-admin-measurement"),
    path('profile/', views.profile, name="user-admin-profile"),
    path('source/', views.source, name="user-admin-source"),
    path('source/<int:pk>', views.source_detail, name="user-source-detail"),
    path('source-delete/<int:pk>', views.delete_source, name='user-source-delete'),
    path('topic/', views.topic, name="user-admin-topic"),
    path('topic/<int:pk>', views.topic_detail, name="user-topic-detail"),
    path('topic-delete/<int:pk>', views.delete_topic, name='user-topic-delete'),
    path('users/', views.users_list, name="user-admin-user-list")
]
