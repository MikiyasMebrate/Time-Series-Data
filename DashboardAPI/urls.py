from .views import (topic_lists, index , category_list)
from django.urls import path

urlpatterns = [
    path('',index, name="dashboard-index"),
    path('topic_lists/',topic_lists, name="topic_lists"),
    path('category_list/<int:id>/',category_list, name="category_list")
]
