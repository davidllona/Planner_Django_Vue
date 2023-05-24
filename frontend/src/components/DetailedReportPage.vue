<template>
 <div class="table-responsive">
  <table class="table-fill">
   <thead>
    <tr>
     <th class="text-left">ID</th>
     <th class="text-left">Nombre</th>
     <th class="text-left">Desde</th>
     <th class="text-left">Hasta</th>
     <th class="text-left">Color</th>
    </tr>
   </thead>
   <tbody class="table-hover">
    <tr v-for="period in filteredPeriods" :key="period.id">
     <td class="text-left">{{ period.id }}</td>
     <td class="text-left">{{ period.name }}</td>

     <td class="text-left">{{ formatDate(period.start) }}</td>
     <td class="text-left">{{ formatDate(period.end) }}</td>
     <td class="text-left">
      <div class="color-span" :style="{ backgroundColor: period.color }"></div>
     </td>
    </tr>
   </tbody>
  </table>
 </div>
</template>

<script>
import axios from "axios";

export default {
  
 computed: {
  name() {
   return this.$route.query.name || "";
  },
  colors() {
   return this.$route.query.colors || [];
  },
  fromDate() {
   return this.$route.query.fromDate || "";
  },
  toDate() {
   return this.$route.query.toDate || "";
  },
  filteredPeriods() {
   return this.filterPeriods(this.name, this.colors, this.fromDate, this.toDate);
  },
 },
 data() {
  return {
   periods: [],
   showDetailedReport: false,
   detailedData: [],
  };
 },
 
 methods: {
  getPeriods(filters) {
  const params = new URLSearchParams();
  params.set('name', filters.name || '');
  filters.colors.forEach(color => params.append('colors', color));
  params.set('start_date', filters.fromDate || '');
  params.set('end_date', filters.toDate || '');

  axios
    .get("http://localhost:8000/search-periods/", { params })
    .then((response) => {
      this.periods = response.data.periods;
    })
    .catch((error) => {
      console.log(error);
    });

},


filterPeriods(filters) {
  let filteredPeriods = this.periods.slice();

  if (filters.name) {
    filteredPeriods = filteredPeriods.filter((period) => period.name.includes(filters.name));
  }
  if (filters.colors && filters.colors.length > 0) {
    filteredPeriods = filteredPeriods.filter((period) => filters.colors.includes(period.color));
  }

  if (filters.fromDate) {
    const fromDateObj = new Date(filters.fromDate);
    filteredPeriods = filteredPeriods.filter((period) => new Date(period.start) >= fromDateObj);
  }
  if (filters.toDate) {
    const toDateObj = new Date(filters.toDate);
    filteredPeriods = filteredPeriods.filter((period) => new Date(period.end) <= toDateObj);
  }

  filteredPeriods.sort((a, b) => b.id - a.id);

  return filteredPeriods;
},


  formatDate(date) {
   const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
   return new Date(date).toLocaleDateString(undefined, options);
  },
 },
};
</script>
<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100);

body {
 font-family: "Roboto", helvetica, arial, sans-serif;
 font-size: 16px;
 font-weight: 400;
 text-rendering: optimizeLegibility;
}

div.table-title {
 display: block;
 margin: auto;
 max-width: 600px;
 padding: 5px;
 width: 100%;
}

.table-title h3 {
 color: #fafafa;
 font-size: 30px;
 font-weight: 400;
 font-style: normal;
 font-family: "Roboto", helvetica, arial, sans-serif;
 text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
 text-transform: uppercase;
}

/*** Table Styles **/

.table-fill {
 background: white;
 border-radius: 3px;
 border-collapse: collapse;
 height: 320px;
 margin: auto;
 max-width: 90%;
 padding: 5px;
 width: 100%;
 box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
 animation: float 5s infinite;
}

th {
 color: #d5dde5;
 background: #4e5166;
 border-bottom: 4px solid #9ea7af;
 border-right: 1px solid #343a45;
 font-size: 20px;
 font-weight: 100;
 padding: 10px;
 text-align: left;
 text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
 vertical-align: middle;
}

th:first-child {
 border-top-left-radius: 3px;
}

th:last-child {
 border-top-right-radius: 3px;
 border-right: none;
}

tr {
 border-top: 1px solid #c1c3d1;
 border-bottom: 1px solid #c1c3d1;
 color: #666b85;
 font-size: 16px;
 font-weight: normal;
 text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
}

tr:hover td {
 background: #566062;
 color: #ffffff;
 border-top: 1px solid #22262e;
}

tr:first-child {
 border-top: none;
}

tr:last-child {
 border-bottom: none;
}

tr:nth-child(odd) td {
 background: #ebebeb;
}

tr:nth-child(odd):hover td {
 background: #566062;
}

tr:last-child td:first-child {
 border-bottom-left-radius: 3px;
}

tr:last-child td:last-child {
 border-bottom-right-radius: 3px;
}

td {
 background: #ffffff;
 padding: 8px;
 text-align: left;
 vertical-align: middle;
 font-weight: 300;
 font-size: 18px;
 text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
 border-right: 1px solid #c1c3d1;
}

td:last-child {
 border-right: 0px;
}

th.text-left {
 text-align: left;
}

th.text-center {
 text-align: center;
}

th.text-right {
 text-align: right;
}

td.text-left {
 text-align: center;
}

td.text-center {
 text-align: center;
}

td.text-right {
 text-align: right;
}
.color-span {
 display: block;
 width: 100%; /* Cambia el valor según tu necesidad */
 height: 20px; /* Cambia el valor según tu necesidad */
}
</style>
