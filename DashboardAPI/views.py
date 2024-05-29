from django.db.models import Count
from django.shortcuts import render
from django.http import JsonResponse
from .serializers import DashboardTopicSerializer 
from TimeSeriesBase.models import DashboardTopic , Category, DataValue , Indicator , DataPoint, Month
from django.db.models import Q
from rest_framework.decorators import api_view
import time
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.forms.models import model_to_dict
from UserManagement.forms import LoginFormDashboard
from  UserManagement.decorators import dashboard_user_required
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import login,authenticate,logout



def dashboard_login(request):
    form = LoginFormDashboard(request.POST or None)
    if form.is_valid():
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        user = authenticate(request,email=email,password=password)
        if user is not None and user.is_dashboard:
            login(request, user)
            return redirect('dashboard-index')
        else:
            messages.error(request, 'Invalid Password or Email')
        form = LoginFormDashboard()
    context = {
        'form' : form
    }
    return render(request, 'dashboard-pages/authentication/login.html', context=context)


@login_required(login_url='dashboard-login')
@dashboard_user_required
def index(request):
    return render(request, 'dashboard-pages/dashboard-index.html')




@login_required(login_url='dashboard-login')
def dashboard_logout(request):
    logout(request)
    return redirect('dashboard-login')

@login_required(login_url='dashboard-login')
@dashboard_user_required
@api_view(['GET'])
def pie_chart_data(request):

    if request.method == 'GET':
        topics = list(DashboardTopic.objects.annotate(category_count=Count('category')).select_related().values('id','title_ENG' , 'category_count'))
        topics_id_list = list(DashboardTopic.objects.filter().values_list('id', flat = True))
        category = list(Category.objects.filter(Q(dashboard_topic__id__in=topics_id_list)).annotate(indicator_count=Count('indicator')).select_related().values('id' ,'name_ENG' , 'indicator_count' , 'dashboard_topic__id'))
        latest_year = DataPoint.objects.filter().last()
        category_id_list = list(Category.objects.filter().values_list('id', flat = True))
        indicators = list(Indicator.objects.filter(
    Q(for_category__id__in=category_id_list),
    Q(Q(is_dashboard_visible=True) |  Q(is_dashboard_visible=False)),
    Q(Q(indicator_value__for_datapoint=latest_year) , Q(indicator_value__for_month = None , indicator_value__for_quarter = None))  |# indicator_value__for_datapoint
    Q(Q(indicator_value__for_month__number=9) , Q(indicator_value__for_datapoint=latest_year) ) |  # indicator_value__for_month
    Q(Q(indicator_value__for_quarter__number=4) , Q(indicator_value__for_datapoint=latest_year))  # indicator_value__for_quarter
    ).prefetch_related('datavalue_set').values(
    'id',
    'title_ENG',
    'for_category__id',
    'indicator_value__value',
    'indicator_value__for_datapoint__year_EC',
    'indicator_value__for_month__number'
))
           
           
   
        context = {
            "topics" : topics,
            "category" : category,
            "indicators" : indicators,
            
        }
        
        return JsonResponse(context)



@login_required(login_url='dashboard-login')
@dashboard_user_required
@api_view(['GET'])
def topic_lists(request):

    if request.method == 'GET':
        topics = DashboardTopic.objects.annotate(category_count=Count('category')).select_related()
        # topics = topics.filter(~Q(category_count = 0)) #Only Display with category > 0
        serializer = DashboardTopicSerializer(topics, many=True)
        
        return JsonResponse({'topics':serializer.data})
    


@login_required(login_url='dashboard-login')
@dashboard_user_required
@api_view(['GET'])
def category_list(request , id , topic_type=None): 
               
        indicator_list_id = list(Category.objects.filter(dashboard_topic__id = id).prefetch_related('indicator__set').all().values_list('indicator__id', flat=True))


        
        
        value_filter = list(DataValue.objects.filter( Q(for_indicator__id__in=indicator_list_id) & ~Q(for_datapoint_id__year_EC = None)).select_related("for_datapoint", "for_indicator").values(
            'for_indicator__type_of',
            'value',
            'for_indicator_id',
            'for_datapoint_id__year_EC',
            'for_quarter_id',
            'for_month_id__month_AMH',
            
        ))
        

        queryset = Category.objects.filter(dashboard_topic__id = id).prefetch_related('indicator__set').filter(indicator__is_dashboard_visible = True).values(
                'dashboard_topic__title_ENG',
                'id',
                'name_ENG',
                'name_AMH',
                'indicator__id',
                'indicator__title_ENG',
                'indicator__title_AMH',
                'indicator__is_dashboard_visible',
                'indicator__type_of'
                
            )
        
        if 'q' in request.GET:
            q = request.GET['q']
            queryset = Category.objects.filter().prefetch_related('indicator__set').filter(Q(indicator__title_ENG__contains=q) | Q(indicator__for_category__name_ENG__contains=q) ).values(
                'dashboard_topic__title_ENG',
                'id',
                'name_ENG',
                'name_AMH',
                'indicator__id',
                'indicator__title_ENG',
                'indicator__title_AMH',
                'indicator__is_dashboard_visible',
                'indicator__type_of'
            )
            indicator_list_id = queryset.values_list('indicator__id', flat=True)

            value_filter = list(DataValue.objects.filter( Q(for_indicator__id__in=indicator_list_id) & ~Q(for_datapoint_id__year_EC = None)).select_related("for_datapoint", "for_indicator").values(
            'for_indicator__type_of',
            'value',
            'for_indicator_id',
            'for_datapoint_id__year_EC',
            'for_quarter_id',
            'for_month_id__month_AMH',
            
        ))

        
        paginator = Paginator(queryset, 20) 
        page_number = request.GET.get('page')
        try:
            page_obj = paginator.page(page_number)
        except PageNotAnInteger:
            # if page is not an integer, deliver the first page
            page_obj = paginator.page(1)
        except EmptyPage:
            # if the page is out of range, deliver the last page
            page_obj = paginator.page(paginator.num_pages)

    
        return JsonResponse(
            {
            'categories':list(queryset), 
            'has_previous' : page_obj.has_previous(),
            'has_next' : page_obj.has_next(),
            'previous_page_number' : page_obj.has_previous() and page_obj.previous_page_number() or None,
            'next_page_number' : page_obj.has_next() and page_obj.next_page_number() or None,
            'number' : int(page_obj.number),
            'page_range':list(page_obj.paginator.page_range),
            'num_pages' : page_obj.paginator.num_pages,
            'values':value_filter , 
             })


@login_required(login_url='dashboard-login')
@dashboard_user_required
@api_view(['GET'])
def category_detail_lists(request , id):

    if request.method == 'GET':
        category = Category.objects.filter(id = id).first()
        indicators = Indicator.objects.filter(for_category__id = category.pk).select_related()
        
        indicator_list_id = list(indicators.select_related().values_list('id', flat=True))
        month = list(Month.objects.all().values())
        value_filter = list(DataValue.objects.filter( Q(for_indicator__id__in=indicator_list_id) & ~Q(for_datapoint_id__year_EC = None)).select_related("for_datapoint", "for_indicator").values(
            'for_indicator__type_of',
            'value',
            'for_indicator_id',
            'for_datapoint_id__year_EC',
            'for_quarter_id',
            'for_month_id__month_AMH',
            'for_month_id__number',
        ))

        year = set(DataValue.objects.filter( Q(for_indicator__id__in=indicator_list_id) & ~Q(for_datapoint_id__year_EC = None)).select_related("for_datapoint", "for_indicator").values_list(
            'for_datapoint_id__year_EC',flat=True
        ))


        serialized_indicator = list(indicators.values('id', 'title_ENG', 'type_of'))
        return JsonResponse({'indicators': serialized_indicator,'months' : month,'values': value_filter, 'year' : list(year)})


@login_required(login_url='dashboard-login')
@dashboard_user_required    
@api_view(['GET'])
def indicator_detail(request, id):
     if request.method == 'GET':
        single_indicator = Indicator.objects.get(pk = id)
        
        indicator_list_id = []
        indicator_list_id.append(single_indicator.pk)

        returned_json = []
        returned_json.append(model_to_dict(single_indicator))

        def child_list(parent):
            for i in list(Indicator.objects.all().values()):
                if i['parent_id'] == parent.id:
                    indicator_list_id.append(i['id'])
                    returned_json.append(i)
                    child_list(Indicator.objects.get(id = i['id']))
                    
        child_list(single_indicator)

        value_filter = list(DataValue.objects.filter( Q(for_indicator__id__in=indicator_list_id) & ~Q(for_datapoint_id__year_EC = None)).select_related("for_datapoint", "for_indicator").values(
            'for_indicator__type_of',
            'value',
            'for_indicator_id',
            'for_datapoint_id__year_EC',
            'for_quarter_id',
            'for_month_id__month_AMH',
        ))

        
        return JsonResponse({'indicators': list(returned_json), 'values' : value_filter})
     
     else:
          return JsonResponse({'indicators': 'failed to access.'})


@login_required(login_url='dashboard-login')
@dashboard_user_required
def search_category_indicator(request):
    queryset = []
    if 'search' in request.GET:
            q = request.GET['search']
            print(q)
            queryset = Category.objects.filter().prefetch_related('indicator__set').filter(Q(indicator__title_ENG__contains=q) | Q(indicator__for_category__name_ENG__contains=q) ).values(
                'name_ENG',
                'indicator__title_ENG',
            )
    return JsonResponse({'indicators': list(queryset)})
    
        


