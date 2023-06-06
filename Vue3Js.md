# VueJs 3

### Origen de Django

Vue.js, comúnmente conocido como Vue, es un framework JavaScript de código abierto para la construcción de interfaces de usuario interactivas. Fue creado por Evan You, un exingeniero de Google, y la primera versión estable de Vue se lanzó en febrero de 2014.

La motivación detrás de la creación de Vue fue proporcionar a los desarrolladores una herramienta más sencilla y flexible para construir aplicaciones web. Evan You buscaba un framework que combinara las mejores características de AngularJS (un framework más complejo) y las características reactivas de React (un enfoque más declarativo). El objetivo era crear un framework ligero y progresivo que fuera fácil de aprender y de integrar en proyectos existentes.

Vue.js se basa en el modelo de Vista-Modelo-Vista de Microsoft (MVVM) y se centra en la capa de vista de una aplicación web. Ofrece una sintaxis clara y concisa para enlazar datos y realizar renderizado condicional, lo que permite a los desarrolladores crear interfaces de usuario dinámicas y reactivas con facilidad.

Algunas de las características clave de Vue.js incluyen:

+ **Reactividad:** Vue permite enlazar datos a elementos de la interfaz de usuario, de modo que los cambios en los datos se reflejen automáticamente en la vista y viceversa. Esto se logra a través de su sistema de reactividad, que rastrea las dependencias y actualiza la interfaz de usuario de manera eficiente.

+ **Componentes:** Vue.js se basa en el concepto de componentes reutilizables. Los componentes de Vue son instancias independientes con su propia lógica, plantilla y estilos. Pueden ser anidados y combinados para construir interfaces de usuario complejas.

+ **Directivas:** Vue ofrece un conjunto de directivas integradas que permiten manipular el DOM de manera declarativa. Las directivas son atributos especiales que se aplican a los elementos HTML y controlan su comportamiento.

+ **Enrutamiento:** Aunque Vue.js en sí mismo no tiene un enrutador incorporado, es fácil integrar bibliotecas de enrutamiento como Vue Router para gestionar la navegación entre diferentes vistas en una aplicación Vue.

+ **Gestión de estado:** Vue.js proporciona una solución ligera para la gestión del estado de la aplicación a través de su sistema de observadores y eventos. Sin embargo, también es compatible con bibliotecas de administración de estado más avanzadas, como Vuex, si se requiere una gestión del estado más compleja.

<div style="page-break-after: always;"></div> 

### Instalación de Vue.js 3
<div style="margin-bottom: 10px;"></div>

```
npm install -g @vue/cli
```

### Creación de un proyecto con Vue CLI:
```
vue create mi-proyecto
```

### Estructura de un proyecto Vue.js:
<div style="margin-bottom: 10px;"></div>

Una vez que hayas creado el proyecto con Vue CLI, se generará una estructura básica de archivos y carpetas.

+ **main.js:** Este archivo es la entrada principal de tu aplicación. Aquí se crea la instancia principal de Vue y se monta en el elemento DOM de la página.

+ **App.vue:** Este archivo representa el componente raíz de tu aplicación. Contiene la estructura básica de la página y puede incluir otros componentes.

+ **components/:** Esta carpeta contiene los componentes de tu aplicación. Cada componente se define en su propio archivo con extensión .vue, que incluye la plantilla, la lógica y los estilos del componente.

+ **public/:** Aquí se encuentran los archivos estáticos que se copiarán directamente en la carpeta de salida de la aplicación. Puedes colocar imágenes, archivos CSS, fuentes u otros recursos aquí.

+ **views/:** Esta carpeta puede contener componentes que representan vistas específicas de tu aplicación. Cada vista puede contener múltiples componentes.

+ **router/:** Si configuraste la opción de enrutamiento al crear tu proyecto, encontrarás esta carpeta. Contiene archivos relacionados con la configuración del enrutamiento de tu aplicación.

+ **store/:** Si configuraste la opción de almacenamiento al crear tu proyecto, encontrarás esta carpeta. Contiene archivos relacionados con la configuración del almacenamiento global de tu aplicación.
<div style="margin-bottom: 30px;"></div>

### Ventajas de Vue.js 3
<div style="margin-bottom: 10px;"></div>

+ Pequeño tamaño y rendimiento eficiente.
+ Curva de aprendizaje suave y fácil integración en proyectos existentes.
+ Sintaxis clara y flexible para enlazar datos y realizar renderizado condicional.
+ Componentes reutilizables y capacidad de componer la aplicación de manera modular.
+ Gran cantidad de herramientas y complementos disponibles.
+ Documentación completa y comunidad activa.

<div style="page-break-after: always;"></div>

### Desventajas de Vue.js 3
<div style="margin-bottom: 10px;"></div>

+ Algunos complementos y bibliotecas pueden no estar tan ampliamente disponibles como en otros frameworks.
+ A medida que los proyectos crecen en complejidad, se requiere una estructura y gestión adecuadas para mantener el código mantenible.



### Código básico de Vue.js
<div style="margin-bottom: 10px;"></div>

En **App.vue:**
```
<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '¡Hola, Vue.js 3!'
    };
  }
};
</script>

<style scoped>
h1 {
  color: red;
}
</style>
```
<div style="margin-bottom: 30px;"></div>

### Enlace un componente con otro
<div style="margin-bottom: 10px;"></div>

En Vue.js, para enlazar un componente con otro y configurar la navegación entre ellos, se utiliza el enrutador (router). El enrutador permite definir rutas y asociarlas con componentes específicos en tu aplicación.

1. Asegúrate de haber instalado el paquete vue-router en tu proyecto:
    ```
    npm install vue-router
    ```
2. Crea un archivo router/index.js en tu proyecto y define las rutas y configuraciones del enrutador. Por ejemplo:vue-router en tu proyecto:

    <div style="page-break-after: always;"></div> 

    ```
    import { createRouter, createWebHistory } from 'vue-router';
    import Home from '../views/Home.vue';
    import About from '../views/About.vue';
    
    const routes = [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/about',
        name: 'About',
        component: About
      }
    ];
    
    const router = createRouter({
      history: createWebHistory(),
      routes
    });
    
    export default router;
    ```
    En este ejemplo, hemos creado dos rutas: una para el componente **Home.vue** y otra para el componente **About.vue**. Cada ruta tiene una **path** (ruta URL), un **name** (nombre) y un component (componente asociado).

3. En el archivo **main.js**, importa y utiliza el enrutador:
    ```
    import { createApp } from 'vue';
    import App from './App.vue';
    import router from './router';

    const app = createApp(App);
    app.use(router);
    app.mount('#app');
    ```
    Aquí, estamos importando el enrutador que definimos en el paso anterior y lo usamos con la aplicación principal.

4. Finalmente, en tus componentes, puedes utilizar enlaces **<router-link** para navegar entre las rutas. Por ejemplo, en el componente **Home.vue**:
    <div style="page-break-after: always;"></div>

    ```
    <template>
      <div>
        <h1>Home</h1>
        <router-link to="/about">Ir a la página Acerca de</router-link>
      </div>
    </template>
    ```
    El componente router-link generará un enlace que al hacer clic, navegará a la ruta especificada.

    El enrutador en Vue.js permite que la navegación entre componentes se realice sin necesidad de recargar la página completa. Cuando el usuario hace clic en un enlace o utiliza el enrutamiento programático, el enrutador gestiona el cambio de componente en el área de visualización sin recargar toda la página.

    El enrutador también ofrece características avanzadas, como rutas anidadas, rutas con parámetros dinámicos y transiciones de página.