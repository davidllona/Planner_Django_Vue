from django.urls import path
from .views import HomeView, GetTasksFromDBView, PeriodCreateView,GetPeriodsFromDBView,UpdateTaskName,UpdatePeriodColor, PeriodDeleteView,UpdatePeriodEnd, UpdatePeriodStart,UpdateTaskPosition, UpdatePeriodView, TaskListView, LoginView
app_name = 'task'

urlpatterns = [
    path('', HomeView.as_view(), name='index'),
    path('read_task/', GetTasksFromDBView.as_view(), name='read_task'),
    path('create-period/', PeriodCreateView.as_view(), name='create_period'),
    path('get-periods/', GetPeriodsFromDBView.as_view(),name='get-periods' ),
    path('update_task_name/', UpdateTaskName.as_view(), name='update_task_name'),
    path('delete-period/<int:pk>/', PeriodDeleteView.as_view(), name='delete-period'),
    path('update-period-color/<int:pk>/', UpdatePeriodColor.as_view(), name='update_period_color'),
    path('update_period_end/<int:pk>/', UpdatePeriodEnd.as_view(), name='update_period_end'),
    path('update_period_start/<int:pk>/', UpdatePeriodStart.as_view(), name='update_period_start'),
    path('update_task_position/', UpdateTaskPosition.as_view(), name='update_task_position'),
    path('update_period/', UpdatePeriodView.as_view(), name='update_period'),
    path('api/tasks/', TaskListView.as_view(), name='task-list'),
    path('login/', LoginView.as_view(), name='login'),
    
]


