from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from .models import Task, Period
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json

# Create your views here.
class HomeView(View):
    def get(self, request):
        return render(request,'index.html')
    
class ReadDatabaseView(View):
    def get(self, request):
        tasks = Task.objects.all().order_by('id')
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
        data = request.POST
        name = data.get('name', '') # vacio por defecto
        color = data.get('color', 'blue') # blue por defecto
        start = data.get('start', '')
        end = data.get('end', start) # igual al start por defecto
        task_id = data.get('task_id', '')
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

            }

            periods_result.append(period_dict)

        return JsonResponse({'periods': periods_result})

class UpdateTaskName(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(UpdateTaskName, self).dispatch(request, *args, **kwargs)
    def post(self, request):
        task_id = request.POST.get('id')
        task_name = request.POST.get('name')
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

# class PeriodDeleteView(View):
#     def delete(self, request, pk):
#         period = get_object_or_404(Period, pk=pk)
#         period.delete()
#         message = f'Period eliminated'
#         return JsonResponse({'message': message})

class UpdatePeriodColor(View):
    def post(self, request, pk):
        try:
            period = Period.objects.get(id=pk)
            color = request.POST.get('color')
            period.color = color
            period.save()
            return JsonResponse({'success': True})
        except Period.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Period not found.'})