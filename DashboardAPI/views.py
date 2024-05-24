from django.shortcuts import render

from django.db.models import Count

# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse
from .serializers import DashboardTopicSerializer , CategorySerializer , CategorySerializer 
from TimeSeriesBase.models import DashboardTopic , Category, DataValue , Indicator
from django.db.models import Q
from rest_framework.decorators import api_view
import time
from django.db.models import Max



def index(request):

    return render(request, 'dashboard-pages/dashboard-index.html')




@api_view(['GET'])
def pie_chart_data(request):

    if request.method == 'GET':
        topics = list(DashboardTopic.objects.annotate(category_count=Count('category')).select_related().values('title_ENG'))
        topics_id_list = list(DashboardTopic.objects.filter().values_list('id', flat = True))
        category = list(Category.objects.filter(Q(dashboard_topic__id__in=topics_id_list)).annotate(category_count=Count('indicator')).select_related().values('name_ENG' , 'category_count'))
        category_id_list = list(Category.objects.filter().values_list('id', flat = True))
        indicators = list(Indicator.objects.filter(Q(for_category__id__in=category_id_list)).values('title_ENG'))
          

        context = {
            "topics" : topics,
            "category" : category,
            "indicators" : indicators,
            
        }
        
        return JsonResponse(context)

# Create your views here.
@api_view(['GET'])
def topic_lists(request):

    if request.method == 'GET':
        topics = DashboardTopic.objects.annotate(category_count=Count('category')).select_related()
        topics = topics.filter(~Q(category_count = 0)) #Only Display with category > 0
        serializer = DashboardTopicSerializer(topics, many=True)
        
        return JsonResponse({'topics':serializer.data})
    



@api_view(['GET'])
def category_list(request , id):

        indicator_list_id = list(Category.objects.filter(dashboard_topic__id = id).prefetch_related('indicator__set').all().values_list('indicator__id', flat=True))

        
        value_filter = list(DataValue.objects.filter( Q(for_indicator__id__in=indicator_list_id) & ~Q(for_datapoint_id__year_EC = None)).select_related("for_datapoint", "for_indicator").values(
            'for_indicator__type_of',
            'value',
            'for_indicator_id',
            'for_datapoint_id__year_EC',
            'for_quarter_id',
            'for_month_id__month_AMH',
        ))



        queryset = list(
            Category.objects.filter(dashboard_topic__id = id).prefetch_related('indicator__set').filter(indicator__is_dashboard_visible = True).values(
                'dashboard_topic__title_ENG',
                'id',
                'name_ENG',
                'name_AMH',
                'indicator__id',
                'indicator__title_ENG',
                'indicator__title_AMH',
                'indicator__is_dashboard_visible'
                
            )
        )
        
        return JsonResponse({'categories':queryset, 'values':value_filter})



@api_view(['GET'])
def category_detail_lists(request , id):

    if request.method == 'GET':
        category = Category.objects.filter(id = id).first()
        indicators = Indicator.objects.filter(for_category__id = category.pk).select_related()
        
        indicator_list_id = list(indicators.select_related().values_list('id', flat=True))

        value_filter = list(DataValue.objects.filter( Q(for_indicator__id__in=indicator_list_id) & ~Q(for_datapoint_id__year_EC = None)).select_related("for_datapoint", "for_indicator").values(
            'for_indicator__type_of',
            'value',
            'for_indicator_id',
            'for_datapoint_id__year_EC',
            'for_quarter_id',
            'for_month_id__month_AMH',
        ))
        serialized_indicator = list(indicators.values('id', 'title_ENG', 'type_of'))
        return JsonResponse({'indicators': serialized_indicator,'values': value_filter})
    
    