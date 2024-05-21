from django.shortcuts import render

from django.db.models import Count

# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse
from .serializers import DashboardTopicSerializer , CategorySerializer
from TimeSeriesBase.models import DashboardTopic , Category

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


def index(request):

    return render(request, 'dashboard-pages/dashboard-index.html')


# Create your views here.
@api_view(['GET'])
def topic_lists(request):

    if request.method == 'GET':
        topics = DashboardTopic.objects.annotate(category_count=Count('category')).select_related()
        serializer = DashboardTopicSerializer(topics, many=True)
        return JsonResponse({'topics':serializer.data})
    




@api_view(['GET'])
def category_list(request , id):
    if request.method == 'GET':
        category = Category.objects.filter(dashboard_topic__id = id)
        serializer = CategorySerializer(category, many=True)
        return JsonResponse({'categories':serializer.data})
    