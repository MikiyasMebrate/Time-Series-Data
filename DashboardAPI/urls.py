from .views import (topic_lists, index , dashboard_logout, category_list , category_detail_lists , pie_chart_data, search_category_indicator, dashboard_login)

from .views import (topic_lists, index  , category_list , category_detail_lists, indicator_detail,pie_chart_data)
from django.urls import path
from django.contrib.auth import views as auth_views
from .forms import UserPasswordResetForm, UserPasswordConfirmForm


urlpatterns = [
    path('',index, name="dashboard-index"),
    path('login/',dashboard_login, name="dashboard-login"),
     path('login/',dashboard_logout, name="dashboard-logout"),
    path('topic_lists/',topic_lists, name="topic_lists"),
    path('pie_chart_data/',pie_chart_data, name="pie_chart_data"),
    path('category_list/<int:id>/',category_list, name="category_list"),
    path('category_detail_list/<int:id>/',category_detail_lists, name="category_detail_lists"),
    path('indicator-detail/<int:id>/',indicator_detail, name='indicator-detail'),
    path('search_category_indicator/',search_category_indicator, name='search_category_indicator'),


    #### RESET PASSWORD
    #dashboard-pages/authentication/
    path('password_reset/', auth_views.PasswordResetView.as_view(template_name='dashboard-pages/authentication/reset_password.html', form_class=UserPasswordResetForm), name='password_reset'),
    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(template_name='dashboard-pages/authentication/password_reset_done.html'), name='password_reset_done'),
    path(r'reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(template_name="dashboard-pages/authentication/password_reset_confirm.html",form_class=UserPasswordConfirmForm), name='password_reset_confirm'),
    path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(template_name="dashboard-pages/authentication/password_reset_complete.html"), name='password_reset_complete'),

]
