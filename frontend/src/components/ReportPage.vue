<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

 
  <div class="navbarReport">
   <router-link to="/home">
     <img src="../assets/logo-practikalia-neg-fit.svg" alt="" />
   </router-link>
   <div class="user-avatar" @click="toggleDropdownAvatar">
     <img src="../assets/17.jpg" alt="Usuario" />
   </div>
   <div class="dropdown-menu" v-if="dropdownOpenAvatar">
    <ul>
      <li @click="logout">
        <div class="speech-bubble">
          <span>Logout</span>
        </div>
      </li>
    </ul>
  </div>
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
         <input type="radio" value="detailed" id="detallado-radio" class="radio" v-model="selectedReportType" />
        </div>
        <div class="radio-container_informs">
         <!-- Agregar clase dropdown -->
         <label for="agregado-radio">Agregado</label>
         <input type="radio" value="aggregated" id="agregado-radio" class="radio" v-model="selectedReportType" />
        </div>
       </div>
      </div>
     </div>
    </div>
 
    <button class="button" @click="showFilters()">Mostrar</button>
    <!-- showTable = true"-->
    <button class="button-download" @click="downloadPDF">Descargar</button>
    <i class="fas fa-trash" id="trash-icon"></i>
   </div>
 
   <!-- Contenido de la pagina-->
   <div class="content">
    <div class="tittle">
      <h1 v-if="!showDetailedReport && !showAgreggatedReport" class="welcome">Bienvenido</h1>
      <h1 v-else-if="showDetailedReport" class="detailed">Detallado</h1>
      <h1 v-else class="agreggated">Agregado</h1>
      <h4 v-if="!showDetailedReport && !showAgreggatedReport" class="description">Aquí podrás buscar y ver todo lo relacionado con tus tareas</h4>
    </div>
    <div class="cards-container">
    <div class="cards" v-if="!showDetailedReport && !showAgreggatedReport">  
      <div class="row">
        <div class="example-1 card">
          <div class="wrapper">
            <div class="data">
              <div class="content_card">
                <h1 class="title_card">Tareas completadas</h1>
                <p class="text"> Tienes un numero de {{ completedTasks }} tareas completadas hasta la fecha de hoy</p>
              </div> 
            </div>
          </div>
        </div>
        <div class="example-1 card">
          <div class="wrapper">
            <div class="data">
              <div class="content_card">
                <h1 class="title_card">Tareas completadas</h1>
                <p class="text"> Tienes un numero de {{ completedTasks }} tareas completadas hasta la fecha de hoy</p>
              </div> 
            </div>
          </div>
        </div>
        <div class="example-1 card">
          <div class="wrapper">
            <div class="data">
              <div class="content_card">
                <h1 class="title_card">Tareas completadas</h1>
                <p class="text"> Tienes un numero de {{ completedTasks }} tareas completadas hasta la fecha de hoy</p>
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </div>
  
    <div class="table" id="table">
      <DetailedReportPage ref="detailedReport" v-if="showDetailedReport" />
      <AggregatedPage ref="aggregatedReport" v-if="showAgreggatedReport" />
    </div>
  </div>
  
  </div>
 </template>
 
 <script>
 import flatpickr from "flatpickr";
 import "flatpickr/dist/flatpickr.min.css";
 import axios from "axios";
 import DetailedReportPage from "@/components/DetailedReportPage.vue";
 import AggregatedPage from "@/components/AggregatedPage.vue";
 import html2pdf from "html2pdf.js";
 
 
 
 export default {
  components: {
   DetailedReportPage,
   AggregatedPage,
  },
  data() {
   return {
    tasks: [],
    searchText: "",
    dropdownOpen: false,
    dropdownOpenAvatar: false,
    selectedColors: [], // Agrega esta línea
    tasksToShow: [],
    detailed: false,
    aggregated: false,
    nombreUsuario: "",
    showDetailedReport: false,
    showAgreggatedReport: false,
    name: "",
    colors: [],
    fromDate: null,
    toDate: null,
    periodsToShow: [],
    showTable: false,
    selectedReportType: "detailed",
    completedTasks: 0,
    remainingPeriods: 0,

    
   };
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

   this.getCompletedPeriods();
   this.getRemainingPeriods();
 
   this.getColors();
   this.getTasksNames();
  },
 
  methods: {
    async getCompletedPeriods() {
      try {
        const response = await axios.get("http://localhost:8000/api/completed-periods/");
        this.completedTasks = response.data.completedTasks;
        console.log(this.completedTasks)
      } catch (error) {
        console.log(error);
      }
    },

    async getRemainingPeriods() {
      try {
        const response = await axios.get("http://localhost:8000/api/remaining-periods/");
        this.remainingPeriods = response.data.remainingPeriods;
      } catch (error) {
        console.log(error);
      }
    },

// async getAllTasks() {
//   try {
//     const response = await axios.get("http://localhost:8000/api/tasks/");
//     this.tasks = response.data.tasks;
//   } catch (error) {
//     console.log(error);
//   }
// },

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
   toggleDropdownAvatar() {
     this.dropdownOpenAvatar = !this.dropdownOpenAvatar;
   },
   logout() {
  axios.post('http://localhost:8000/logout/')
    .then(response => {
      // Lógica después del logout exitoso
      console.log(response);
      // Eliminar la cookie asociada al usuario
      document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = '/login';
    })
    .catch(error => {
      // Manejo de errores
      console.log(error);
    });
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
     })
     .catch((error) => {
      console.log(error);
     });
   },
 
   showFilters() {
   if (this.selectedReportType === "detailed") {
     this.showDetailedReport = true;
     this.showTable = true;
     this.showAgreggatedReport = false;
 
     const filters = {
       name: this.searchText,
       colors: this.selectedColors,
       fromDate: this.fromDate,
       toDate: this.toDate,
     };
 
     this.$nextTick(() => {
       if (this.showDetailedReport) {
         this.$refs.detailedReport.getPeriods(filters);
       }
     });
   } else if (this.selectedReportType === "aggregated") {
     this.showDetailedReport = false;
     this.showTable = true; // Cambiado de `this.showAgreggatedReport = true;`
     this.showAgreggatedReport = true;
   }
 
 },
 downloadPDF() {
   const element = document.querySelector(".table");
   const options = {
     margin: [10, 0, 0, 0],
     filename: "informe.pdf",
     image: { type: "jpeg", quality: 0.98 },
     html2canvas: { scale: 2 },
     jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
   };
 
   html2pdf().set(options).from(element).saveAs(); // Usa saveAs en lugar de save
 },
 
 
 
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
 .speech-bubble {
  background-color: #fff;
  border-radius: 4px;
  padding: 5px 10px;
  position: relative;
  display: inline-block;
  margin-right: 2%;
}

.speech-bubble::before {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 20px;
  border-color: transparent transparent #fff transparent;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
}

 .user-avatar {
   width: 40px;
   height: 40px;
   border-radius: 50%;
   background-color: #ccc; /* Agrega un color de fondo para el círculo */
   float: right;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
   transform: translate(0, -50%);
   top: 50%;
   margin-right: 2%;
   
 }
 
 .user-avatar img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   border-radius: 50%;
 }
 
 .dropdown-menu {
   position: absolute;
   right: 0;
   top: 7%;
   background-color: #fff;
   border: 1px solid #ccc;
   border-radius: 4px;
 }
 
 .dropdown-menu ul {
   list-style: none;
   padding: 0;
   margin: 0;
 }
 
 .dropdown-menu li {
   padding: 8px 10px;
   cursor: pointer;
 }
h1 {
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
}
.row {
  margin: 50px 5% 0;
}
.cards .row {
  display: flex;
}
.card {
  float: left;
  padding: 0 1.7rem;
  width: 50%;
}
.card .menu-content {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.card .menu-content::before, .card .menu-content::after {
  content: '';
  display: table;
}
.card .menu-content::after {
  clear: both;
}
.card .menu-content li {
  display: inline-block;
}
.card .menu-content a {
  color: #fff;
}
.card .menu-content span {
  position: absolute;
  left: 50%;
  top: 0;
  font-size: 10px;
  font-weight: 700;
  font-family: 'Open Sans';
  transform: translate(-50%, 0);
}
.card .wrapper {
  background-color: #fff;
  min-height: 540px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.2);
}
.card .wrapper:hover .data {
  transform: translateY(0);
}
.card .data {
  position: absolute;
  bottom: 0;
  width: 100%;
  transform: translateY(calc(70px + 1em));
  transition: transform 0.3s;
}
.card .data .content {
  padding: 1em;
  position: relative;
  z-index: 1;
}
.card .author {
  font-size: 12px;
}
.title_card {
  padding: 10px;
}
.card .text {
  height: 70px;
  margin: 0;
  padding-left: 10px;
}
.card input[type='checkbox'] {
  display: none;
}
.card input[type='checkbox']:checked + .menu-content {
  transform: translateY(-60px);
}
.example-1 .wrapper {
  background-image: url("../assets/coffe\ time-6010.svg");
  background-position: 52% 1%;
  background-size: cover;
  background-repeat: no-repeat;
}

.example-1 .date {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #77d7b9;
  color: #fff;
  padding: 0.8em;
}
.example-1 .date span {
  display: block;
  text-align: center;
}
.example-1 .date .day {
  font-weight: 700;
  font-size: 24px;
  text-shadow: 2px 3px 2px rgba(0, 0, 0, 0.18);
}
.example-1 .date .month {
  text-transform: uppercase;
}
.example-1 .date .month, .example-1 .date .year {
  font-size: 12px;
}
.example-1 .content_card {
  background-color: #fff;
  box-shadow: 0 5px 30px 10px rgba(0, 0, 0, 0.3);
}
.example-1 .title a {
  color: #808080;
}
.example-1 .menu-button {
  position: absolute;
  z-index: 999;
  top: 16px;
  right: 16px;
  width: 25px;
  text-align: center;
  cursor: pointer;
}
.example-1 .menu-button span {
  width: 5px;
  height: 5px;
  background-color: #808080;
  color: #808080;
  position: relative;
  display: inline-block;
  border-radius: 50%;
}
.example-1 .menu-button span::after, .example-1 .menu-button span::before {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  background-color: currentColor;
  position: absolute;
  border-radius: 50%;
}
.example-1 .menu-button span::before {
  left: -10px;
}
.example-1 .menu-button span::after {
  right: -10px;
}
.example-1 .menu-content {
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  transition: transform 0.3s;
  transform: translateY(0);
}
.example-1 .menu-content li {
  width: 33.333333%;
  float: left;
  background-color: #77d7b9;
  height: 60px;
  position: relative;
}
.example-1 .menu-content a {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
}
.example-1 .menu-content span {
  top: -10px;
}
.example-2 .wrapper {
  background: url(https://tvseriescritic.files.wordpress.com/2016/10/stranger-things-bicycle-lights-children.jpg) center / cover no-repeat;
}
.example-2 .wrapper:hover .menu-content span {
  transform: translate(-50%, -10px);
  opacity: 1;
}
.example-2 .header {
  color: #fff;
  padding: 1em;
}
.example-2 .header::before, .example-2 .header::after {
  content: '';
  display: table;
}
.example-2 .header::after {
  clear: both;
}
.example-2 .header .date {
  float: left;
  font-size: 12px;
}
.example-2 .menu-content {
  float: right;
}
.example-2 .menu-content li {
  margin: 0 5px;
  position: relative;
}
.example-2 .menu-content span {
  transition: all 0.3s;
  opacity: 0;
}
.example-2 .data {
  color: #fff;
  transform: translateY(calc(70px + 4em));
}
.example-2 .title a {
  color: #fff;
}
.example-2 .button {
  display: block;
  width: 100px;
  margin: 2em auto 1em;
  text-align: center;
  font-size: 12px;
  color: #fff;
  line-height: 1;
  position: relative;
  font-weight: 700;
}
.example-2 .button::after {
  content: '\2192';
  opacity: 0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  transition: all 0.3s;
}
.example-2 .button:hover::after {
  transform: translate(5px, -50%);
  opacity: 1;
}

 img {
  width: 20%;
  height: 50%;
  position: relative;
  top: 50%;
  transform: translate(0, -50%);
 }
 .detailed {
  text-align: center;
 }
 .agreggated{
   text-align: center;
 }
 #trash-icon {
  color: #ffffff;
  bottom: 0;
  position: absolute;
  right: 0;
  padding: 20px;
  cursor: pointer;
 }
 
 .table {
   height: 80%;
   overflow-x: auto;
   position: relative;
   width: 100%; /* Cambia max-content por 100% */
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
   width: 90%; /* Cambia 80% por el porcentaje deseado */
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
  width: 94%;
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
   position: relative;
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
 }
 .welcome{
   margin-left: 5%;
 }
 .description{
   margin-left: 5%;
 }
 /* Estilos para dispositivos con pantalla grande */
 @media only screen and (min-width: 768px) {
  /* Filtro */
  .filter {
   height: 100%;
   width: 20%;
   background-color: #566062;
   position: relative;
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
 