from .views import (topic_lists, index , category_list , category_detail_lists)
from django.urls import path

urlpatterns = [
    path('',index, name="dashboard-index"),
    path('topic_lists/',topic_lists, name="topic_lists"),
    path('category_list/<int:id>/',category_list, name="category_list"),
    path('category_detail_list/<int:id>/',category_detail_lists, name="category_detail_lists")
]
