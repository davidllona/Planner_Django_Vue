# Django


### Origen de Django


Django es un framework web de alto nivel y de código abierto que fue desarrollado por Adrian Holovaty y Simon Willison. Inicialmente, Django fue creado como una herramienta interna para la creación rápida de aplicaciones web en el periódico Lawrence Journal-World en Kansas, Estados Unidos. El framework fue lanzado como software libre en julio de 2005 bajo la Licencia BSD.

Django se ha convertido en uno de los frameworks web más populares y ampliamente utilizados en la comunidad de desarrollo web. Ha sido adoptado por numerosas organizaciones y empresas de todo el mundo para desarrollar aplicaciones web escalables, robustas y seguras.

La filosofía detrás de Django se centra en la eficiencia y la simplicidad. El framework proporciona una serie de componentes y herramientas preconstruidas que facilitan el desarrollo web, permitiendo a los desarrolladores concentrarse en la lógica de la aplicación en lugar de tener que preocuparse por aspectos técnicos complejos.

Django ofrece características poderosas como un ORM (Object-Relational Mapping) para interactuar con la base de datos, un sistema de enrutamiento flexible, un sistema de plantillas para generar la interfaz de usuario, un sistema de autenticación y autorización, un administrador automático y un enfoque de desarrollo basado en el principio DRY (Don't Repeat Yourself), entre muchas otras funcionalidades.

<div style="margin-bottom: 30px;"></div>

### Estructura de Django
<div style="margin-bottom: 10px;"></div>

Django sigue el patrón de diseño MVC (Modelo-Vista-Controlador) o, más precisamente, el patrón de diseño MTV (Modelo-Plantilla-Vista). A continuación se muestra una descripción general de los componentes clave de Django:

+ **Modelos** Representan la estructura y relaciones de la base de datos. Los modelos se definen mediante clases en Python y Django se encarga de crear las tablas en la base de datos.
    
+ **Vistas:** Las vistas son funciones o clases que procesan las solicitudes de los usuarios y devuelven una respuesta. Pueden interactuar con los modelos para obtener o guardar datos y renderizar plantillas.

+ **Plantillas:** Definen la presentación de las páginas web utilizando una sintaxis especial de Django que mezcla HTML con etiquetas y variables dinámicas.

+ **URLs:** Django utiliza un enrutador de URLs para mapear las solicitudes de los usuarios a las vistas correspondientes. Puedes definir patrones de URL en un archivo de configuración y asociarlos con vistas específicas.

+ **Configuración:** Django tiene un archivo de configuración donde se especifican detalles como la base de datos, las rutas estáticas y otros ajustes específicos de la aplicación.
 <div style="page-break-after: always;"></div> 

### Ventajas de Django
<div style="margin-bottom: 10px;"></div>

+ **Productividad:** Django proporciona un conjunto completo de herramientas y componentes que facilitan el desarrollo web rápido y eficiente.
+ **Escalabilidad:** Django está diseñado para manejar cargas de trabajo pesadas y puede escalar tanto vertical como horizontalmente.
+ **Seguridad:** Django incluye características de seguridad como protección contra ataques de inyección SQL, CSRF (Cross-Site Request Forgery) y XSS (Cross-Site Scripting).
+ **Documentación:** Django cuenta con una amplia y detallada documentación, así como una gran comunidad de desarrolladores que ofrecen soporte y recursos.
+ **Versatilidad:** Django se puede utilizar para desarrollar una amplia gama de aplicaciones web, desde simples sitios hasta aplicaciones empresariales complejas.
<div style="margin-bottom: 30px;"></div>

### Desventajas de Django
<div style="margin-bottom: 10px;"></div>

+ **Curva de aprendizaje:** Django puede tener una curva de aprendizaje pronunciada para los principiantes, especialmente si no están familiarizados con el patrón de diseño MVC o el lenguaje Python.
+ **Complejidad:** A medida que las aplicaciones se vuelven más complejas, el manejo de algunas características avanzadas de Django, como las relaciones entre modelos, puede requerir un mayor esfuerzo de desarrollo y comprensión.
<div style="margin-bottom: 30px;"></div>

### Codigo básico de Django
<div style="margin-bottom: 10px;"></div>

1. En tu terminal, crea un nuevo proyecto de Django:
    ```
    django-admin startproject mi_proyecto
    ```
2. Crea una nueva aplicación dentro del proyecto:
    ```
    cd mi_proyecto
    python manage.py startapp mi_app
    ```
   
3. En el archivo mi_proyecto/mi_app/views.py, define una vista que devuelve el saludo:
    ```
    from django.http import HttpResponse

    def saludo(request):
        return HttpResponse("¡Hola, Django!")
    ```
     <div style="page-break-after: always;"></div> 
4. En el archivo mi_proyecto/mi_app/urls.py, agrega una ruta para la vista:
    ```
    from django.urls import path
    from .views import saludo

    urlpatterns = [
        path('saludo/', saludo, name='saludo'),
    ]
    ```
5. En el archivo mi_proyecto/mi_proyecto/urls.py, incluye las rutas de la aplicación:
    ```
    from django.contrib import admin
    from django.urls import include, path

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('mi_app/', include('mi_app.urls')),
    ]
    ```
6. Ejecuta el servidor de desarrollo de Django:
    ```
    python manage.py runserver
    ```         
7. Abre tu navegador en http://localhost:8000/mi_app/saludo/ y deberías ver el saludo "¡Hola, Django!".    
<div style="margin-bottom: 30px;"></div>

### Archivos típicos en una aplicación
<div style="margin-bottom: 10px;"></div>

1. **models.py:** Este archivo define los modelos de datos de la aplicación. Los modelos son clases de Python que representan las tablas de la base de datos y sus relaciones. Aquí defines los campos y métodos que componen tus modelos.

2. **views.py:** En este archivo se definen las vistas de la aplicación. Las vistas son funciones o clases que reciben solicitudes HTTP y devuelven una respuesta. Puedes utilizar los modelos, realizar operaciones de base de datos y renderizar plantillas para generar la respuesta.

3. **urls.py:** Este archivo define las rutas de URL para tu aplicación. Puedes especificar las URL y asociarlas a vistas particulares.

4. **forms.py:** Aquí puedes definir formularios personalizados para tu aplicación. Los formularios se utilizan para capturar datos ingresados por los usuarios. Django proporciona un conjunto de campos y validaciones integradas, y puedes personalizarlos según tus necesidades.

5. **admin.py:** Django incluye un sistema de administración automático que te permite administrar los datos de tu aplicación a través de una interfaz de administración. En este archivo puedes registrar tus modelos para que sean administrables a través de esta interfaz.

6. **templates/:** Esta carpeta contiene las plantillas HTML utilizadas para renderizar las páginas web. Puedes utilizar la sintaxis de plantillas de Django para mezclar código HTML con etiquetas y variables dinámicas que se llenarán con datos específicos.

7. **static/:** Aquí se almacenan los archivos estáticos de tu aplicación, como hojas de estilo CSS, archivos JavaScript o imágenes. Estos archivos se sirven directamente al navegador sin ser procesados por Django.

8. **migrations/:** Django utiliza las migraciones para mantener la consistencia de la base de datos a medida que evolucionas tus modelos. Este directorio contiene archivos de migración generados automáticamente que describen los cambios en la estructura de la base de datos.
<div style="margin-bottom: 30px;"></div>

### Consultas en Django (Python)
<div style="margin-bottom: 10px;"></div>

1. Todos los objetos de un modelo:
    ```tsx
    Model.object.all()
    ```

2. Filtrar para que se cumpla una condicion:
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

 <div style="page-break-after: always;"></div>

7. Ordenar objetos de un modelo:
    ```tsx
     Model.objects.order_by('campo')
    ```


8. Obtener un subconjunto de objetos de un modelo:
    ```tsx
     Model.objects.all()[inicio:fin]
    ```

<div style="margin-bottom: 30px;"></div>

### Ejemplos 

<div style="margin-bottom: 10px;"></div>

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


