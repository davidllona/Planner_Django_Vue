<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

  <div class="navbarReport">
    <img src="../assets/logo-practikalia-neg-fit.svg" alt="">
  </div>
  <div class="container">
    <div class="filter">
      <div class="search-container">
        <input
          type="input"
          class="search-input"
          placeholder="Introduce el nombre de la tarea"
          name="name"
          id="name"
          required
        />
      </div>

      <div class="dropdown-color-container">
        <div class="dropdown">
          <div class="dropdown__title">
            <span class="dropdown__title-text">Color</span>
            <i id="icon-arrow" class="fas fa-chevron-down"></i>
          </div>
          <div class="dropdown__content">
            <!-- Contenido del dropdown -->
          </div>
        </div>
      </div>

      <div class="date-picker">
        <div class="date-picker__from">
          <span>Desde</span>
          <input type="text" id="date-input-from" class="from-date-input" placeholder="--.--.--">
        </div>
        <div class="date-picker__to">
          <span>Hasta</span>
          <input type="text" id="date-input-to" class="to-date-input" placeholder="--.--.--">
        </div>
      </div>

      <div class="dropdown-color-container">
        <div class="dropdown">
          <div class="dropdown__title">
            <span class="dropdown__title-text">Informes</span>
            <i id="icon-arrow" class="fas fa-chevron-down"></i>
          </div>
          <div class="dropdown__content">
            <!-- Contenido del dropdown -->
          </div>
        </div>
      </div>
      
    </div>
    <div class="content"></div>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default {
  mounted() {
    flatpickr(".from-date-input", {
      dateFormat: "d/m/Y",
      onClose: function(selectedDates) {
        console.log(selectedDates); // Mostrar fecha seleccionada en la consola
      }
    });

    flatpickr(".to-date-input", {
      dateFormat: "d/m/Y",
      onClose: function(selectedDates) {
        console.log(selectedDates); // Mostrar fecha seleccionada en la consola
      }
    });

    
  }
};
</script>
<style>
.navbarReport {
  width: 100%;
  height: 75px;
  background-color: #566062;
  border-bottom: 2px solid #3E494D;
}
img {
  width: 20%;
  margin-top: 1%;
  height: 65%;
}
.container {
  width: 100%;
  height: calc(100vh - 77px);
  display: flex;
}
.filter {
  height: 100%;
  width: 25%;
  background-color: #566062;
}
.content {
  width: 80%;
  height: 100%;
}
.form__group {
  position: relative;
  margin-top: 10px;
  width: 100%;
  margin-top: 40px;
}
input {
  line-height: 1;
  margin-bottom: 10px; /* añade un margen inferior para separar del siguiente elemento */
}

.search-container {
  width: 80%;
  background-color: #3e494d;
  margin-top: 40px;
  margin-left: 9%;
}
.search-input {
  width: 95%;
  border: 0;
  border-bottom: 2px solid #ffffff;
  outline: 0;
  font-size: 15px;
  margin-left: 2%;
  color: #fff;
  padding: 10px 0;
  background: transparent;
  transition: border-color 0.2s;
  font-family: sans-serif;
}
.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #9b9b9b;
}
::placeholder {
  color: white;
  font-size: 15px;
}
/*Dropwdown*/
.dropdown-color-container{
  width: 80%;
  background-color: #3e494d;
  margin-top: 40px;
  margin-left: 9%;
}
.dropdown{
  padding: 15px;
}
.dropdown__title-text{
  color: white;
}
#icon-arrow{
  color: white;
  float: right;
}
/*Calendar*/
.date-picker{
  width: 80%;
  background-color: #3e494d;
  margin-top: 40px;
  margin-left: 9%;
  display: flex;
}
span{
  color: #fff;
}
.flatpickr-day:not(.flatpickr-disabled):not(.flatpickr-not-in-month) {
  color: #000;
}
.flatpickr-day.selected:not(.flatpickr-disabled):not(.flatpickr-not-in-month) {
  background-color: #B94EC5;
  color: #fff;
  border-color: #B94EC5;
}
#date-input-from::placeholder{
  color: white;
  text-align: center;
}
#date-input-from{
  background-color: #3e494d;
  border: none;
  color: white;
  text-align: center;
  font-size: 15px;
  padding-top: 5px;
}
#date-input-to::placeholder{
  color: white;
  text-align: center;
}
#date-input-to{
  background-color: #3e494d;
  border: none;
  color: white;
  text-align: center;
  font-size: 15px;
  padding-top: 5px;
}
.date-picker__from{
  text-align: center;
  padding: 10px 0 10px 0;
  border-right: 1px solid #707070;
}
.date-picker__to{
  text-align: center;
  padding: 10px 0 10px 0;
 
}
.flatpickr-input[readonly] {
  cursor: pointer;
  width: 96%;
}

/* Estilos para dispositivos móviles */
@media only screen and (max-width: 767px) {
  /* Navbar */
  .navbarReport {
    height: 50px;
  }

  /* Contenedor principal */
  .container {
    flex-direction: column;
    height: auto;
  }

  /* Filtro */
  .filter {
    width: 100%;
    height: auto;
  }

  /* Búsqueda */
  .search-container {
    width: 90%;
    margin-left: 5%;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .search-input {
    width: 100%;
    margin-left: 0;
    margin-bottom: 0;
  }

  /* Dropdown */
  .dropdown-color-container {
    width: 90%;
    margin-left: 5%;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  /* Calendar */
  .date-picker {
    width: 90%;
    margin-left: 5%;
    margin-top: 10px;
    margin-bottom: 10px;
    flex-direction: column;
  }

  .date-picker__from {
    margin-bottom: 10px;
  }

  .date-picker__to {
    margin-top: 10px;
  }

  #date-input-from {
    margin-bottom: 5px;
  }

  #date-input-to {
    margin-top: 5px;
  }
}

/* Estilos para dispositivos con pantalla grande */
@media only screen and (min-width: 768px) {
  /* Filtro */
  .filter {
    height: 100%;
    width: 25%;
    background-color: #566062;
  }

  /* Contenido */
  .content {
    width: 75%;
    height: 100%;
  }

  /* Búsqueda */
  .search-container {
    width: 80%;
    margin-left: 9%;
  }

  /* Dropdown */
  .dropdown-color-container {
    width: 80%;
    margin-left: 9%;
  }

  /* Calendar */
  .date-picker {
    width: 80%;
    margin-left: 9%;
    display: flex;
  }

  #date-input-from {
    margin-right: 10px;
  }
}



@media (max-width: 767px) {
  .flatpickr-calendar {
    position: static !important;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .flatpickr-month {
    width: 100%;
  }

  .flatpickr-days {
    width: 100%;
  }

  .flatpickr-innerContainer {
    width: 100%;
  }

  .flatpickr-current-month {
    width: 100%;
  }

  .flatpickr-prev-month,
  .flatpickr-next-month {
    display: none;
  }
}








</style>
