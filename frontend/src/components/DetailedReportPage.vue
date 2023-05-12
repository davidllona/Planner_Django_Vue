<template>
 <div>
  <p>Nombre: {{ name }}</p>
  <p>Colores: {{ colors }}</p>
  <p>Desde: {{ fromDate }}</p>
  <p>Hasta: {{ toDate }}</p>
  <table>
   <thead>
    <tr>
     <th>ID Periodo</th>
     <th>Nombre</th>
     <th>Color</th>
     <th>Desde</th>
     <th>Hasta</th>
    </tr>
   </thead>
   <tbody>
    <tr v-for="period in filteredPeriods" :key="period.id">
     <td>{{ period.id }}</td>
     <td>{{ period.name }}</td>
     <td>{{ period.color }}</td>
     <td>{{ period.start }}</td>
     <td>{{ period.end }}</td>
    </tr>
   </tbody>

  </table>
 </div>
</template>
<script>
import axios from "axios";

export default {
 props: {
  name: String,
  colors: String,
  fromDate: String,
  toDate: String,
 },
 data() {
  return {
   periods: [],
  };
 },
 created() {
  this.getPeriods();
 },
 methods: {
    getPeriods() {
   const params = {
    name: this.name,
    color: this.colors.split(","), // Convertir la cadena en un arreglo de cadenas
    start_date: this.fromDate,
    end_date: this.toDate,
   };
   axios.get("http://localhost:8000/search-periods/", { params }).then((response) => {
    this.periods = response.data.periods;
   });
  },

  filterPeriods() {
  let filteredPeriods = this.periods;
  if (this.name) {
    filteredPeriods = filteredPeriods.filter((period) => period.name === this.name);
  }
  if (this.colors) {
    const selectedColors = this.colors.split(",");
    filteredPeriods = filteredPeriods.filter((period) => selectedColors.includes(period.color));
  }
  if (this.fromDate) {
    const fromDateObj = new Date(this.fromDate);
    filteredPeriods = filteredPeriods.filter((period) => new Date(period.start) >= fromDateObj);
  }
  if (this.toDate) {
    const toDateObj = new Date(this.toDate);
    filteredPeriods = filteredPeriods.filter((period) => new Date(period.end) <= toDateObj);
  }
  const result = filteredPeriods.length > 0 ? filteredPeriods : [];
  return result;
},


 },
 computed: {
  filteredPeriods() {
   return this.filterPeriods();
  },
 },
};
</script>
