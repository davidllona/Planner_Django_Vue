from django.urls import path
from .views import HomeView, ReadDatabaseView

urlpatterns = [
    path('', HomeView.as_view(), name='index'),
    path('read_database/', ReadDatabaseView.as_view(), name='read_database'),
    
    
]

