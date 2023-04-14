1. Todos los objetos de un modelo:
```tsx
 Model.object.all()
```

2. iltrar para que se cumpla una condicion:
```tsx
 Model.objects.filter(condicion)
```

3. Obtener un solo objeto de un modelo:
```tsx
 Model.objects.get(condicion)
```


4. Excluir objetos de un modelo que cumplan una condición:
```tsx
 Model.objects.exclude(condicion)
```


5. Obtener objetos relacionados a través de una clave foránea:
```tsx
 Model.relacionados.all()
```


6. Obtener objetos relacionados a través de una clave foránea y que cumplan una condición:
```tsx
 Model.relacionados.filter(condicion)
```


7. Ordenar objetos de un modelo:
```tsx
 Model.objects.order_by('campo')
```


8. Obtener un subconjunto de objetos de un modelo:
```tsx
 Model.objects.all()[inicio:fin]
```


## Ejemplos 

1. Obtener todas las tareas:
```tsx
 tasks = Task.objects.all()
```

2. Obtener todas las tareas ordenadas por posición: tasks = Task.objects.order_by('position'):
```tsx
 Obtener todas las tareas ordenadas por posición
```

3. Obtener todas las tareas que contengan la palabra 'compra' en su nombre:
```tsx
 tasks = Task.objects.filter(name__contains='compra')
```
4. Obtener todas las tareas cuya posición sea mayor a 5:
```tsx
 tasks = Task.objects.filter(position__gt=5)
```
5. Obtener la tarea con id=1:
```tsx
 task = Task.objects.get(id=1)
```
6. Obtener la cantidad de tareas existentes:
```tsx
task_count = Task.objects.count()
```

