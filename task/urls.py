from django.urls import path
from .views import HomeView, GetTasksFromDBView, PeriodCreateView,GetPeriodsFromDBView,UpdateTaskName,UpdatePeriodColor, PeriodDeleteView,UpdatePeriodEnd, UpdatePeriodStart,UpdateTaskPosition, UpdatePeriodView, TaskListView, LoginView, SearchTaskView, ColorsView, SearchPeriodsView, UpdatePeriodName
app_name = 'task'

urlpatterns = [
    path('', HomeView.as_view(), name='index'),
    path('read_task/', GetTasksFromDBView.as_view(), name='read_task'),
    path('create-period/', PeriodCreateView.as_view(), name='create_period'),
    path('get-periods/', GetPeriodsFromDBView.as_view(),name='get-periods' ),
    path('update_task_name/', UpdateTaskName.as_view(), name='update_task_name'),
    path('update_period_name/', UpdatePeriodName.as_view(), name='update_task_name'),
    path('delete-period/<int:pk>/', PeriodDeleteView.as_view(), name='delete-period'),
    path('update-period-color/<int:pk>/', UpdatePeriodColor.as_view(), name='update_period_color'),
    path('update_period_end/<int:pk>/', UpdatePeriodEnd.as_view(), name='update_period_end'),
    path('update_period_start/<int:pk>/', UpdatePeriodStart.as_view(), name='update_period_start'),
    path('update_task_position/', UpdateTaskPosition.as_view(), name='update_task_position'),
    path('update_period/', UpdatePeriodView.as_view(), name='update_period'),
    path('api/tasks/', TaskListView.as_view(), name='task-list'),
    path('login/', LoginView.as_view(), name='login'),
    path('search-task/', SearchTaskView.as_view(), name='search_task'),
    path('api/colors/', ColorsView.as_view(), name='colors'),
    path('get_current_user/', ColorsView.as_view(), name='colors'),
    path('search-periods/', SearchPeriodsView.as_view(), name='periods'),

    
]


