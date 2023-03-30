from django.urls import path
from .views import HomeView, GetTasksFromDBView, PeriodCreateView,GetPeriodsFromDBView,UpdateTaskName,UpdatePeriodColor, PeriodDeleteView,UpdatePeriodEnd
urlpatterns = [
    path('', HomeView.as_view(), name='index'),
    path('read_task/', GetTasksFromDBView.as_view(), name='read_task'),
    path('create-period/', PeriodCreateView.as_view(), name='create_period'),
    path('get-periods/', GetPeriodsFromDBView.as_view(),name='get-periods' ),
    path('update_task_name/', UpdateTaskName.as_view(), name='update_task_name'),
    path('delete-period/<int:pk>/', PeriodDeleteView.as_view(), name='delete-period'),
    path('update-period-color/<int:pk>/', UpdatePeriodColor.as_view(), name='update_period_color'),
    path('update_period_end/<int:pk>/', UpdatePeriodEnd.as_view(), name='update_period_end'),
]

