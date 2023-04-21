from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views import View
from .models import Task, Period
from django.db import models
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json
from django.contrib.auth import authenticate, login

# Create your views here.
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
            start = request.POST.get('start')
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
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'user': user.username})
        else:
            return JsonResponse({'success': False})