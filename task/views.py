
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View
from .models import Task, Period
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from django.shortcuts import render
from django.contrib.auth import authenticate, login
import jwt
from django.conf import settings
from datetime import datetime
from django.db.models import Avg, Count, Max, Min, F, ExpressionWrapper, DurationField
from datetime import timedelta
from django.db.models import Q
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.translation import gettext as _
from django.shortcuts import get_object_or_404
from datetime import date
from decimal import Decimal
from django.db.models.functions import TruncMonth

class HomeView(View):
    def get(self, request):
        return render(request,'index.html')
    
class GetTasksFromDBView(View):
    def get(self, request):
        tasks = Task.objects.all().order_by('position')
        task_list = []
        for task in tasks:
            task_list.append({
                'id': task.id,
                'name': task.name,
                'position': task.position,
            })
        return JsonResponse({'tasks': task_list})   

class PeriodCreateView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(PeriodCreateView, self).dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = request.body
        data = json.loads(data)
        print(data)
        name = data.get('name', '') # vacio por defecto
        color = data.get('color', 'blue') # blue por defecto
        start = data.get('start', '')
        end = data.get('end', start) # igual al start por defecto
        task_id = data.get('task_id', None)
        task = Task.objects.get(id=task_id)
        period = Period(name=name, color=color, start=start, end=end, task_id=task.id)
        period.save()
        return JsonResponse({'status': 'success', 'message': 'Period created successfully!'})

class GetPeriodsFromDBView(View):
    def get(self, request):
        periods = Period.objects.all()

        # Convertimos los perdios a una lista de diccionarios para que sean compatibles con JsonResponse
        periods_result = []
        for period in periods:
            period_dict = {
                    'name': period.name,
                    'color': period.color,
                    'start': period.start.strftime('%Y-%m-%d'),
                    'end': period.end.strftime('%Y-%m-%d'),
                    'task_id': period.task.id,
                    'id': period.id, # Agrega la clave-valor de la ID aquí

            }

            periods_result.append(period_dict)

        return JsonResponse({'periods': periods_result})

class UpdateTaskName(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UpdateTaskName, self).dispatch(request, *args, **kwargs)
    
    def post(self, request):
        data = request.body
        data = json.loads(data)
        task_id = data.get('id')
        task_name = data.get('name')
        
        try:
            task = Task.objects.get(id=task_id)
            task.name = task_name
            task.save()
            message = f'Task name updated to {task_name}'
            return JsonResponse({'message': message})
        except Task.DoesNotExist:
            message = f'Task with id {task_id} does not exist'
            return JsonResponse({'message': message})
        except Exception as e:
            message = str(e)
            return JsonResponse({'message': message})
        
class UpdatePeriodName(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UpdatePeriodName, self).dispatch(request, *args, **kwargs)
    
    def post(self, request):
        data = request.body
        data = json.loads(data)
        period_id = data.get('id')
        period_name = data.get('name')
        
        try:
            period = Period.objects.get(id=period_id)
            period.name = period_name  # set the name field to the received name value
            period.save()
            message = f'Period name updated to {period_name}'
            return JsonResponse({'message': message})
        except Period.DoesNotExist:
            message = f'Period with id {period_id}'
        except Exception as e:
            message = str(e)
            return JsonResponse({'message': message})

class PeriodDeleteView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(PeriodDeleteView, self).dispatch(request, *args, **kwargs)
    def delete(self, request, pk):
        period = get_object_or_404(Period, pk=pk)
        period.delete()
        message = f'Period eliminated'
        return JsonResponse({'message': message})

class UpdatePeriodColor(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UpdatePeriodColor, self).dispatch(request, *args, **kwargs)        
    def post(self, request, pk):
        try:
            period = Period.objects.get(id=pk)
            data = json.loads(request.body)
            color = data.get('color')
            period.color = color
            period.save()
            return JsonResponse({'success': True})
        except Period.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Period not found.'})
        
class UpdatePeriodEnd(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UpdatePeriodEnd, self).dispatch(request, *args, **kwargs)
        
    def post(self, request, pk):
        try:
            period = Period.objects.get(id=pk)
            data = json.loads(request.body)
            end = data.get('end')
            period.end = end
            period.save()
            return JsonResponse({'success': True})
        except Period.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Period not found.'})

class UpdatePeriodStart(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UpdatePeriodStart, self).dispatch(request, *args, **kwargs)

    def post(self, request, pk):
        try:
            period = Period.objects.get(id=pk)
            data = json.loads(request.body)
            start = data['start']
            period.start = start
            period.save()
            return JsonResponse({'success': True})
        except Period.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Period not found.'})

class UpdateTaskPosition(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        task_id = request.POST.get("id")
        new_position = int(request.POST.get("position"))
        task = Task.objects.get(id=task_id)
        current_position = task.position
        
        # Update positions of all other tasks
        if current_position < new_position:
            # Move task down in the list
            tasks_to_update = Task.objects.filter(position__gt=current_position, position__lte=new_position)
            for t in tasks_to_update:
                t.position -= 1
                t.save()
        elif current_position > new_position:
            # Move task up in the list
            tasks_to_update = Task.objects.filter(position__lt=current_position, position__gte=new_position)
            for t in tasks_to_update:
                t.position += 1
                t.save()
        
        # Update the position of the task in the database
        task.position = new_position
        task.save()
                
        return JsonResponse({"message": "Task position updated successfully."})
    
class UpdatePeriodView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        period_id = request.POST.get("period_id")
        new_task_id = request.POST.get("new_task_id")
        new_start_date = request.POST.get("new_start_date")
        new_end_date = request.POST.get("new_end_date")

        try:
            period = Period.objects.get(id=period_id)
            period.task_id = new_task_id
            period.start = new_start_date
            period.end = new_end_date
            period.save()
            return JsonResponse({"success": True})
        except Period.DoesNotExist:
            return JsonResponse({"success": False})            

class TaskListView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        tasks = Task.objects.filter(position__gt=5).order_by('position')
        task_list = []
        for task in tasks:
            task_list.append({
                'id': task.id,
                'name': task.name,
                'position': task.position,
            })
        return JsonResponse({'tasks': task_list})   

class LoginView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginView, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token = jwt.encode({'username': username}, settings.SECRET_KEY, algorithm='HS256').decode('utf-8')

            return JsonResponse({'success': True, 'token': token})
        else:
            return JsonResponse({'success': False, 'error': 'Usuario o contraseña incorrectos.'})    

class ColorsView(View):
    def get(self, request):
        colors = Period.objects.values('color').annotate(count=Count('color')).values('color').distinct().order_by('color')
        color_list = [c['color'] for c in colors]
        print(color_list)
        return JsonResponse({'colors': color_list})
   
class SearchTaskView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(SearchTaskView, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        tasks = Task.objects.all()
        data = {'tasks': list(tasks.values())}
        return JsonResponse(data, safe=False)

    def post(self, request):
        search_str = request.POST.get('searchText', None)
        if search_str is not None:
            tasks = Task.objects.filter(name__icontains=search_str)
            data = {'tasks': list(tasks.values())}
            return JsonResponse(data, safe=False)
        return JsonResponse({'error': 'Invalid request'})    
    
class SearchPeriodsTasksView(View):
    def get(self, request):
        search_str = request.GET.get('search_str')

        # Search tasks containing the search query and their associated periods
        tasks = Task.objects.filter(name__icontains=search_str)
        task_data = []
        for task in tasks:
            periods = Period.objects.filter(task_id=task.id, name__icontains=search_str)
            for period in periods:
                task_data.append({
                    'id': task.id,
                    'name': task.name,
                    'period_id': period.id,
                    'period_name': period.name,
                    'period_color': period.color,
                    'period_start': period.start,
                    'period_end': period.end,
                })
    
        data = {'tasks': task_data}
        return JsonResponse(data)  

class SearchPeriodsView(View):
    
     def get(self, request):
        name = request.GET.get('name')
        colors = request.GET.getlist('colors')
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')

        periods = Period.objects.all()
        if name:
            periods = periods.filter(Q(name__icontains=name))
        if colors:
            periods = periods.filter(color__in=colors)
        
        start_date = None  # Inicializar start_date fuera del bloque condicional
        end_date = None  # Inicializar end_date fuera del bloque condicional
        
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            periods = periods.filter(start__gte=start_date, end__lte=end_date)
            print(start_date_str, end_date_str, start_date, end_date)
        else:
            print(start_date_str, end_date_str)
        
        print(start_date_str)
        print(end_date_str)
        print(start_date)
        print(end_date)
        print(colors)
        
        
        data = {'periods': list(periods.values('id', 'name', 'color', 'start', 'end'))}
        print(data)
        return JsonResponse(data)

class AggregatedPageView(View):
    def get(self, request):
        # Cálculo de la duración total y el número de periodos
        total_duration = timedelta()
        num_periods = 0

        for periodo in Period.objects.all():
            duration = periodo.end - periodo.start
            if duration.total_seconds() == 0:
                duration = timedelta(days=1)
            total_duration += duration
            num_periods += 1

        # Cálculo de la duración media
        avg_duration = total_duration / num_periods if num_periods > 0 else timedelta()

        # Cálculo de la duración máxima y mínima
        max_duration = Period.objects.aggregate(
            max_duration=Max(ExpressionWrapper(F('end') - F('start'), output_field=DurationField()))
        )['max_duration']
        max_duration = max_duration or timedelta()

        min_duration = Period.objects.aggregate(
            min_duration=Min(ExpressionWrapper(F('end') - F('start'), output_field=DurationField()))
        )['min_duration']
        min_duration = min_duration or timedelta(days=1)

        # Cálculo del número de periodos
        num_periods = Period.objects.count()

        # Cálculo del número medio de periodos por tarea
        avg_periods_per_task = Period.objects.values('task_id').annotate(count=Count('task_id')).aggregate(
            avg_periods_per_task=Avg('count')
        )['avg_periods_per_task']

        # Convertir la duración media de los periodos a un formato más legible
        avg_duration_str = str(avg_duration.days) + ' ' + _('día(s)') + ', ' + str(avg_duration.seconds // 3600) + ':' + str((avg_duration.seconds // 60) % 60).zfill(2) + ':' + str(avg_duration.seconds % 60).zfill(2)

        # Construir el diccionario de respuesta
        data = {
            'avg_duration': avg_duration_str,
            'num_periods': num_periods,
            'avg_periods_per_task': avg_periods_per_task,
            'max_duration': str(max_duration.days) + ' ' + _('día(s)'),
            'min_duration': str(min_duration.days) + ' ' + _('día(s)'),
        }

        return JsonResponse(data)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=200)

class CompletedPeriodsView(APIView):
    def get(self, request):
        today = date.today()
        completed_periods = Period.objects.filter(end__lt=today).count()
        return Response({'completedTasks': completed_periods})  # Cambiado el nombre a 'completedTasks'

class RemainingPeriodsView(APIView):
    def get(self, request):
        today = date.today()
        remaining_periods = Period.objects.filter(Q(end__gte=today) | Q(end=None)).count()
        return Response({'remainingPeriods': remaining_periods})  # Cambiado el nombre a 'remainingPeriods'

class GetPeriodsCount(View):
    def get(self, request):
        periods = Period.objects.select_related('task').annotate(month=TruncMonth('start')).values('month', 'task__id', 'task__name', 'task__position').annotate(count=Count('id'))

        periods_data = {}
        
        manual_colors = ['#cee7fe', '#b4dbfd', '#97d0fc', '#77c4fb', '#4cb9fa', '#4397cc', '#39779f', '#2f5875', '#233b4d', '#172129']  # Colores manuales

        month_names = {
            'Jan': 'Ene',
            'Feb': 'Feb',
            'Mar': 'Mar',
            'Apr': 'Abr',
            'May': 'May',
            'Jun': 'Jun',
            'Jul': 'Jul',
            'Aug': 'Ago',
            'Sep': 'Sep',
            'Oct': 'Oct',
            'Nov': 'Nov',
            'Dec': 'Dic',
        }

        for entry in periods:
            month = entry['month'].strftime('%b')
            month_spanish = month_names[month]
            task_id = entry['task__id']
            task_name = entry['task__name']
            task_position = entry['task__position']
            count = entry['count']

            if month_spanish not in periods_data:
                periods_data[month_spanish] = []

            color = manual_colors[(task_id - 1) % len(manual_colors)]  # Obtener color de la lista de colores manuales
            periods_data[month_spanish].append({
                'task_id': task_id,
                'task_name': task_name,
                'task_position': task_position,
                'count': count,
                'color': color,
            })
            
        return JsonResponse({'periods_data': periods_data})



class AveragePeriodView(View):
    def get(self, request):
        average_period = Period.objects.values('task_id').annotate(period_count=Count('task_id')).aggregate(avg_period=Avg('period_count'))
        return JsonResponse({'average_period': average_period['avg_period']})
    
class CalculateAverage(View):
    def get(self, request):
        queryset = Period.objects.annotate(
            month=TruncMonth('start')
        ).values('month').annotate(
            count=Count('*'),
            distinct_count=Count('task_id', distinct=True)
        ).values('month', 'count', 'distinct_count').order_by('month')

        results = [
            {
                'month': result['month'].strftime('%Y-%m-%d'),
                'average': Decimal(result['count']) / Decimal(result['distinct_count'])
            }
            for result in queryset
        ]

        return JsonResponse({'average_data': results})








