from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from .models import Task, Period
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator

# Create your views here.
class HomeView(View):
    def get(self, request):
        return render(request,'index.html')
    
class ReadDatabaseView(View):
    def get(self, request):
        tasks = Task.objects.all()
        task_list = []
        for task in tasks:
            task_list.append({
                'id': task.id,
                'name': task.name,
                'position': task.position,
            })
        return JsonResponse({'tasks': task_list})
      
    
    
      




    
    
    
    
    
    
















# @method_decorator(csrf_exempt, name='dispatch')
# class CreateTasksView(View):
#     @method_decorator(csrf_exempt)
#     def dispatch(self, request, *args, **kwargs):
#         return super().dispatch(request, *args, **kwargs)

#     def post(self, request):
#         tasks = request.POST.getlist('tasks[]')
#         for i, _ in enumerate(tasks):
#             task = Task(name='', position=i)
#             task.save()
#         return JsonResponse({'success': True})


# class GetTasksFromDBView(View):
#     def get(self, request):
#         tasks = Period.objects.all().values() #Otra manera

#         # Convertimos las filas a un diccionario para que sean compatibles con JsonResponse
#         task_result = []
#         for task in tasks:
#             task = {
#                 'id': task.id,
#                 'name': task.name,
#                 'color': task.color,
#                 'start': task.start.strftime('%Y-%m-%d'),
#                 'end': task.end.strftime('%Y-%m-%d'),
#             }
#             task_result.append(task)
#         return JsonResponse({'tasks': task_result})
    
    # class CheckTaskExistsView(View):
#     def get(self, request):
#         start = request.GET.get('start')
#         id_row = request.GET.get('id_row')
#         task_exists = Period.objects.filter(start=start, id_row=id_row).exists()
#         return JsonResponse({'exists': task_exists})

# class UpdateTaskNameView(View):
#     @csrf_exempt
#     def post(self, request):
#         id_row = request.POST.get('id_row')
#         taskRowName = request.POST.get('name')
#         print(taskRowName)
#         task_exists = Period.objects.filter(id_row=id_row).exists()
#         if task_exists:
#             task = Period.objects.get(id_row=id_row)
#             task.name = taskRowName
#             task.save()
#             return JsonResponse({'message': 'Nombre de tarea actualizado correctamente'})
#         else:
#             return JsonResponse({'message': 'No se encontró la tarea con el id proporcionado'})

# class AddTaskToDBView(View):
#     @csrf_exempt
#     def post(self, request):
#         taskRowName = request.POST.get('name')  # obtenemos el nombre de la tarea
#         color = request.POST.get('color')  # obtenemos el color de la tarea
#         start = request.POST.get('start')  # obtenemos el inicio de la tarea
#         end = request.POST.get('end')  # obtenemos el final de la tarea
#         id_row = request.POST.get('id_row')  # obtenemos el final de la tarea
#         # Conectamos a la base de datos
#         conn = psycopg2.connect(dbname="taskOrganiser", user="david", password="Y4gueros", host="localhost", port="5432")
#         # Creamos un cursor
#         cur = conn.cursor()
#         # Ejecutamos la consulta INSERT
#         cur.execute('INSERT INTO task_tasks (name, color, start, "end", id_row) VALUES (%s, %s, %s, %s, %s)', (taskRowName, color, start, end, id_row))
#         # Guardamos los cambios en la base de datos
#         conn.commit()
#         # Cerramos la conexión
#         cur.close()
#         conn.close()
#         return JsonResponse({'message': 'Tarea agregada correctamente'})