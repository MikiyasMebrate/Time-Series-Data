from django.urls import path
from . import views

urlpatterns = [
    path('b/', views.index, name="m")
]
