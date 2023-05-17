<template>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />

 <div class="navbarReport">
  <img src="../assets/logo-practikalia-neg-fit.svg" alt="" />
 </div>
 <div class="container">
  <div class="filter">
   <!-- Buscador -->
   <div class="search-container">
    <input
     type="input"
     class="search-input"
     placeholder="Introduce el nombre de la tarea"
     name="name"
     id="name"
     v-model="searchText"
     @input="searchTasks"
    />
   </div>
   <!-- /Buscador -->

   <!-- Colores -->
   <div class="dropdown-color-container">
    <div class="dropdown">
     <div class="dropdown__title" @click="toggleDropdown()">
      <div class="span-color-container">
       <span class="span-color" v-for="color in selectedColors" :key="color" :style="{ backgroundColor: color }">
        <i class="fas fa-times" @click.stop="removeColor(color)"></i>
        <span class="span-color-name">{{ color }}</span>
       </span>
      </div>
      <span v-if="selectedColors.length === 0" class="span-color-name">Color</span>
      <i id="icon-arrow" :class="{ 'fa-chevron-down': !dropdownOpen, 'fa-chevron-up': dropdownOpen }" class="fas"></i>
     </div>
     <div class="dropdown__content" v-if="dropdownOpen">
      <div class="dropdown__content-options color-grid-container">
       <div
        class="color-box"
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: color }"
        @click="toggleColorSelection(color)"
        :class="{ selected: isSelected(color) }"
       ></div>
      </div>
     </div>
    </div>
   </div>

   <!-- Calendario -->
   <div class="date-picker">
    <div class="date-picker__from">
     <span class="span-time">Desde</span>
     <input type="text" id="date-input-from" class="from-date-input" placeholder="--.--.--" v-model="fromDate" />
    </div>
    <div class="date-picker__to">
     <span class="span-time">Hasta</span>
     <input type="text" id="date-input-to" class="to-date-input" placeholder="--.--.--" v-model="toDate" />
    </div>
   </div>

   <!-- Informes -->
   <div class="informs-container">
    <div class="informs">
     <div class="informs__title">
      <span class="span-informs-name">Informes</span>

      <div class="informs__content">
       <div class="radio-container_informs">
        <!-- Agregar clase dropdown -->
        <label for="detallado-radio">Detallado</label>
        <input type="radio" v-model="reportType" value="detailed" id="detallado-radio" class="radio" />
       </div>
       <div class="radio-container_informs">
        <!-- Agregar clase dropdown -->
        <label for="agregado-radio">Agregado</label>
        <input type="radio" v-model="reportType" value="aggregated" id="agregado-radio" class="radio" />
       </div>
      </div>
     </div>
    </div>
   </div>

   <button
    class="button"
    @click="
     showDetailedReport = true;
     showFilters();
    "
   >
    Mostrar
   </button>
   <button class="button-download">Descargar</button>
  </div>

  <!-- Contenido de la pagina-->
  <div class="content">
   <div class="tittle">
    <h1 v-if="!showDetailedReport">Bienvenido</h1>
    <h1 v-else class="detailed">Detallado</h1>
    <h4 v-if="!showDetailedReport">Aquí podrás buscar y ver todo lo relacionado con tus tareas</h4>
   </div>
   <div class="table">
    <DetailedReportPage ref="detailedReport"/>
   </div>
  </div>
 </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import axios from "axios";
import DetailedReportPage from "@/components/DetailedReportPage.vue";

export default {
 components: {
  DetailedReportPage,
 },
 data() {
  return {
    tasks: [],
    searchText: "",
    dropdownOpen: false,
    selectedColors: [], // Agrega esta línea
    tasksToShow: [],
    detailed: false,
    aggregated: false,
    nombreUsuario: "",
    showDetailedReport: false,
    showAgreggatedReport: false,
    reportType: "",
    name: "",
    colors: [],
    fromDate: null,
    toDate: null,
  };
},

 methods: {
  async getColors() {
   try {
    const response = await axios.get("http://localhost:8000/api/colors/");
    this.colors = response.data.colors;
   } catch (error) {
    console.log(error);
   }
  },
  selectColor(color) {
   this.selectedColors = [color];
   this.toggleDropdown();
  },
  toggleColorSelection(color) {
   const index = this.selectedColors.indexOf(color);
   if (index === -1) {
    this.selectedColors.push(color);
   } else {
    this.selectedColors.splice(index, 1);
   }
  },
  isSelected(color) {
   return this.selectedColors.indexOf(color) !== -1;
  },
  removeColor(color) {
   const index = this.selectedColors.indexOf(color);
   if (index !== -1) {
    this.selectedColors.splice(index, 1);
   }
  },
  toggleDropdown() {
   this.dropdownOpen = !this.dropdownOpen;
  },
  /*Buscador*/
  async getTasksNames() {
   try {
    const response = await axios.get("http://localhost:8000/search-task/");
    this.tasks = response.data.tasks;
   } catch (error) {
    console.log(error);
   }
  },
  selectTask(task) {
   this.searchText = task.name;
   this.tasksToShow = [];
  },
  searchTasks() {
   const searchStr = this.searchText.trim().toLowerCase();
   if (searchStr === "") {
    this.tasksToShow = [];
    return;
   }

   axios
    .get("http://localhost:8000/search-periods-tasks/", {
     params: {
      search_str: searchStr,
     },
    })
    .then((response) => {
     this.tasksToShow = response.data.tasks;
     this.periodsToShow = response.data.periods; // Agrega esta línea para obtener los períodos asociados
    })
    .catch((error) => {
     console.log(error);
    });
  },

  showFilters() {
   const name = this.searchText;
   const colors = this.selectedColors.join(", ");
   const detailedReport = this.reportType === "detailed";
   const aggregatedReport = this.reportType === "aggregated";

   console.log(`Name: ${name}`);
   console.log(`Colors: ${colors}`);
   console.log("From date:", this.fromDate);
   console.log("To date:", this.toDate);
   console.log(`Detailed report: ${detailedReport}`);
   console.log(`Aggregated report: ${aggregatedReport}`);



   this.$refs.detailedReport.getPeriods(name, colors, this.fromDate, this.toDate);
   //  this.$router.replace({ name: "Report", query: queryParams });

   this.showDetailedReport = true;
  },
 },
 mounted() {
  flatpickr(".from-date-input", {
   dateFormat: "Y-m-d",
   onClose: function (selectedDates) {
    this.fromDate = selectedDates[0];
   }.bind(this),
  });

  flatpickr(".to-date-input", {
   dateFormat: "Y-m-d",
   onClose: function (selectedDates) {
    this.toDate = selectedDates[0];
   }.bind(this),
  });

  this.getColors();
  this.getTasksNames();
 },
};
</script>

<style>
.navbarReport {
 width: 100%;
 height: 75px;
 background-color: #566062;
 border-bottom: 2px solid #3e494d;
}
img {
 width: 20%;
 margin-top: 1%;
 height: 60%;
}
.detailed {
 text-align: center;
}

.table {
 height: 500px; /* Reemplaza 500px con el height deseado */
 overflow-x: auto;
 position: relative;
 width: max-content;
 margin: 0 auto;
}
.container {
 width: 100%;
 height: calc(100vh - 77px);
 display: flex;
 overflow-y: hidden;
}
.filter {
 height: 100%;
 width: 20%;
 background-color: #566062;
}
.table-container {
 height: 100%; /* Ajusta la altura del contenedor de la tabla según tus necesidades */
 overflow-x: auto;
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
.list-names-result {
 list-style: none;
 color: white;
 padding-bottom: 10px;
 cursor: pointer;
}

/*Dropwdown*/
.dropdown-color-container {
 width: 80%;
 background-color: #3e494d;
 margin-top: 40px;
 margin-left: 9%;
}
.dropdown {
 padding: 15px;
}
.color-grid-container {
 display: grid;
 grid-template-columns: repeat(5, 1fr);
 grid-gap: 8px;
 margin-top: 4px;
}

.color-box {
 height: 30px;
 width: 30px;
 border-radius: 50%;
 cursor: pointer;
 margin-top: 10px;
}

.color-box.selected {
 border: 2px solid #fff;
}

.dropdown__title-text {
 color: white;
 margin-left: 10px;
}
.dropdown__title {
 display: inline-block;
 width: 100%;
}
.color-box-title {
 display: inline-block;
 width: 15px;
 height: 15px;
}
#icon-arrow {
 color: white;
 float: right;
}
.span-color-name {
 color: white;
}

.span-color-container {
 display: flex;
 flex-wrap: wrap;
}

.span-color {
 background-color: #566062;
 margin-right: 5px;
 margin-bottom: 5px;
 padding: 5px;
 color: white;
 display: flex;
 margin-top: 5px;
}
.span-color-name {
 margin-left: 10px;
}
.span-color:hover {
 box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Agrega una sombra al hacer hover */
 cursor: pointer;
}

/*Calendar*/
.date-picker {
 width: 80%;
 background-color: #3e494d;
 margin-top: 40px;
 margin-left: 9%;
 display: flex;
}
.span-time {
 color: white;
}
.flatpickr-day:not(.flatpickr-disabled):not(.flatpickr-not-in-month) {
 color: #000;
}
.flatpickr-day.selected:not(.flatpickr-disabled):not(.flatpickr-not-in-month) {
 background-color: #b94ec5;
 color: #fff;
 border-color: #b94ec5;
}
#date-input-from::placeholder {
 color: white;
 text-align: center;
}
#date-input-from {
 background-color: #3e494d;
 border: none;
 color: white;
 text-align: center;
 font-size: 15px;
 padding-top: 5px;
}
#date-input-to::placeholder {
 color: white;
 text-align: center;
}
#date-input-to {
 background-color: #3e494d;
 border: none;
 color: white;
 text-align: center;
 font-size: 15px;
 padding-top: 5px;
}
.date-picker__from {
 text-align: center;
 padding: 10px 0 10px 0;
 border-right: 1px solid #707070;
}
.date-picker__to {
 text-align: center;
 padding: 10px 0 10px 0;
}
.flatpickr-input[readonly] {
 cursor: pointer;
 width: 96%;
}
/*Informes*/
label {
 color: white;
}
.informs {
 padding: 15px;
}
.informs-container {
 width: 80%;
 background-color: #3e494d;
 margin-top: 40px;
 margin-left: 9%;
}
.infroms__title {
 display: inline-block;
 width: 100%;
}

.checkbox-container_informs {
 padding: 5px;
 padding-left: 15px;
}

.span-informs-name {
 color: white;
 margin-left: 15px;
}
.informs__content {
 margin-top: 5px;
}

/*Boton mostrar*/

.button:active {
 background-color: #0069b4;
 box-shadow: 0 5px #363636;
 transform: translateY(4px);
}
.button-download {
 display: inline-block;
 padding: 10px 50px;
 font-size: 15px;
 cursor: pointer;
 text-decoration: none;
 outline: none;
 color: #fff;
 background-color: #3e494d;
 border: none;
 border-radius: 15px;
 box-shadow: 0 4px #363636;
 margin-top: 40px;
 margin-left: 9%;
 display: flex;
}
.button-download:active {
 background-color: #0069b4;
 box-shadow: 0 5px #363636;
 transform: translateY(4px);
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
 .button {
  display: inline-block;
  padding: 10px 50px;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #3e494d;
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px #363636;
  margin-top: 40px;
  margin-left: 9%;
  display: flex;
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

/*Content*/
.tittle {
 margin-top: 40px;
 margin-left: 5%;
}

/* Estilos para dispositivos con pantalla grande */
@media only screen and (min-width: 768px) {
 /* Filtro */
 .filter {
  height: 100%;
  width: 20%;
  background-color: #566062;
 }

 /* Contenido */
 .content {
  width: 80%;
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
 .color-grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  margin-top: 4px;
 }

 /* Calendar */
 .date-picker {
  width: 80%;
  margin-left: 9%;
  display: flex;
 }
 .button {
  display: inline-block;
  padding: 10px 40px;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #3e494d;
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px #363636;
  margin-top: 40px;
  margin-left: 9%;
  display: flex;
 }
 #date-input-from {
  margin-right: 10px;
 }
}

/*Moviles*/
@media (max-width: 767px) {
 .button {
  display: inline-block;
  padding: 10px 50px;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #3e494d;
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px #363636;
  margin-top: 40px;
  margin-left: 9%;
  display: flex;
 }
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
 .color-grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 8px;
  margin-top: 4px;
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
