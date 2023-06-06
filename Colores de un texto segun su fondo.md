# Color del texto según su color de fondo


**Función para calcular el brillo basado en el color**
```
function getBrightness(color) {
  const rgb = color.substring(1); // Eliminar el símbolo # del inicio
  const r = parseInt(rgb.substring(0, 2), 16); // Obtener el valor numérico del componente rojo
  const g = parseInt(rgb.substring(2, 4), 16); // Obtener el valor numérico del componente verde
  const b = parseInt(rgb.substring(4, 6), 16); // Obtener el valor numérico del componente azul

  const brightness = (r + g + b) / 3; // Calcular el promedio de los componentes RGB

  return brightness; // Devolver el valor del brillo
}
```

**Ejemplo de uso**

```
const color = "#FFA500"; // Color naranja
const brightness = getBrightness(color); // Llamada a la función para calcular el brillo
console.log("Brillo:", brightness); // Imprimir el valor del brillo en la consola
```

En este ejemplo, utilizando el color naranja (**"#FFA500"**):

- Definimos la función getBrightness(color) que toma un color como argumento.
- Eliminamos el símbolo # del inicio del color, quedando FFA500.
- Extraemos los valores numéricos de los componentes RGB del color:

    - El valor numérico del componente rojo (r) se obtiene convirtiendo FF a decimal, que es igual a 255.
    - El valor numérico del componente verde (g) se obtiene convirtiendo A5 a decimal, que es igual a 165.
    - El valor numérico del componente azul (b) se obtiene convirtiendo 00 a decimal, que es igual a 0.


- Calculamos el promedio de los componentes RGB: 

    ```(r + g + b) / 3 = (255 + 165 + 0) / 3 = 420 / 3 = 140```.

- El resultado del cálculo del brillo es 140.
- Imprimimos el valor del brillo en la consola utilizando console.log("Brillo:", brightness), lo que mostrará Brillo: 140.
- Por lo tanto, el brillo del color naranja (#FFA500) es 140.