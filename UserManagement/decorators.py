from django.http import HttpResponse
from django.shortcuts import redirect



def admin_user_required(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_first_time: 
            return  redirect('user-admin-change-password')
        elif request.user.is_superuser  and request.user.is_staff:          
            return view_func(request, *args, **kwargs)
    return wrapper_func


def staff_user_required(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_first_time: 
            return  redirect('staff-change-password')
        elif request.user.is_staff and not request.user.is_superuser:
            return view_func(request, *args, **kwargs)
        else:
             return HttpResponse('You are not authorized to access this content.')
    return wrapper_func