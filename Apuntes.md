
# Apuntes interesantes de Vue
1. DMContentLoaded: es un evento que se dispara cuando se ha cargado todo el contenido html

2. Dataset: se utiliza para acceder a los atributos personalizados de un elemento

Ejemplo: 
```
<div id="mi-elemento" data-id="123" data-nombre="Juan"></div>
```
Pues para acceder a los valores se usa 'dataset'

```const miElemento = document.getElementById("mi-elemento");
console.log(miElemento.dataset.id); // Output: "123"
console.log(miElemento.dataset.nombre); // Output: "Juan"
```


### Manera correcta de enviar datos en vue
En Vue 3, la forma recomendada de enviar datos en una solicitud POST es utilizando la opción body del objeto fetch o de axios. Esta opción debe contener los datos en formato JSON.

Por lo tanto, cuando utilizas axios.post("http://localhost:8000/create-period/", data), estás enviando los datos data como un objeto JavaScript en formato JSON. Cuando el servidor recibe esta solicitud, el cuerpo de la solicitud se puede acceder a través del atributo request.body en Django.

En tu código original, estás tratando de acceder a los datos a través de request.POST, que es para los datos enviados en el cuerpo de la solicitud en formato de formulario, no en formato JSON.

Por lo tanto, al cambiar la forma en que envías los datos desde Vue a JSON y al utilizar json.loads(data) en Django para analizar los datos JSON en un objeto Python, permitiste que Django acceda correctamente a los datos enviados en el cuerpo de la solicitud.




### Seleccion de colores
Este código pertenece a una sección de un componente de Vue.js que se encarga de manejar la selección de colores en un dropdown. A continuación se explica cada una de las funciones:

getColors: es una función asincrónica que se encarga de obtener la lista de colores desde una API a través de una petición HTTP con el método axios.get. En caso de que la petición sea exitosa, la lista de colores obtenida se asigna a la propiedad colors del componente.

selectColor: es una función que se encarga de seleccionar un color específico al hacer clic en el mismo en el dropdown. Recibe como parámetro el color seleccionado y asigna dicho color a la propiedad selectedColors del componente. Además, se llama a la función toggleDropdown para cerrar el dropdown.

toggleColorSelection: es una función que se encarga de cambiar el estado de selección de un color al hacer clic en el mismo en el dropdown. Recibe como parámetro el color en cuestión y utiliza el método indexOf para buscar su índice en el array selectedColors. Si el índice no se encuentra, el color se añade al array; de lo contrario, se elimina del mismo utilizando el método splice.

isSelected: es una función que recibe como parámetro un color y devuelve un valor booleano indicando si dicho color se encuentra seleccionado en el dropdown o no. Para ello, utiliza el método indexOf para buscar el índice del color en el array selectedColors. Si el índice es distinto de -1, el color se encuentra seleccionado.

removeColor: es una función que se encarga de eliminar un color de la lista de colores seleccionados al hacer clic en la "X" correspondiente. Recibe como parámetro el color a eliminar y utiliza el método indexOf para buscar su índice en el array selectedColors. Si el índice no es -1, el color se elimina del array utilizando el método splice.