from django.urls import path
from .views import HomeView, ReadDatabaseView, PeriodCreateView,GetPeriodsFromDBView,UpdateTaskName,UpdatePeriodColor

urlpatterns = [
    path('', HomeView.as_view(), name='index'),
    path('read_database/', ReadDatabaseView.as_view(), name='read_database'),
<<<<<<< HEAD
    path('create-period/', PeriodCreateView.as_view(), name='create_period'),
    path('get-periods/', GetPeriodsFromDBView.as_view(),name='get-periods' ),
    path('update_task_name/', UpdateTaskName.as_view(), name='update_task_name'),
    # path('delete-period/<int:pk>/', PeriodDeleteView.as_view(), name='delete-period'),
    path('update-period-color/<int:pk>/', UpdatePeriodColor.as_view(), name='update_period_color'),
=======
    
    
>>>>>>> 5d42a6d899f9dac447b1222b6fc1f4f1b9a56dfb
]

