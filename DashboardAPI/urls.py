from .views import (topic_lists, index , pie_chart ,  category_list , category_detail_lists , pie_chart_data, search_category_indicator)

from .views import (topic_lists, index  , category_list , category_detail_lists, indicator_detail,pie_chart_data)
from django.urls import path

urlpatterns = [
    path('',index, name="dashboard-index"),
    path('pie_chart/',pie_chart, name="pie_chart"),
    path('topic_lists/',topic_lists, name="topic_lists"),
    path('pie_chart_data/',pie_chart_data, name="pie_chart_data"),
    path('category_list/<int:id>/',category_list, name="category_list"),
    path('category_detail_list/<int:id>/',category_detail_lists, name="category_detail_lists"),
    path('indicator-detail/<int:id>/',indicator_detail, name='indicator-detail'),
    path('search_category_indicator/',search_category_indicator, name='search_category_indicator'),
]
