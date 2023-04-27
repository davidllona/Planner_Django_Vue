<template>
    <!-- Grid -->
    <div class="grid" id="grid">
      <div class="header-months">
        <div
          class="month-header"
          v-for="(month, index) in months"
          :key="index"
          :style="{ width: month.width + 'px' }"
        >
          {{ month.name }}
        </div>
      </div>
    </div>
    <!------------------->
    <DatesTransforming ref="datesTransforming"></DatesTransforming>
    

</template>



<script>
import  DatesTransforming  from  "./DatesTools.vue";
import axios from "axios";
export default {
  name: "GridPlanner",
  components: {
    DatesTransforming
  },
  data() {
    return {
      matrix: [],
      years: [],
      yearsRange: [2023, 2024],
      months: [],
      days: [],
    };
  },
  mounted() {
    this.createMatrixDates();
    this.createHeaderMonths();
    this.createHeader();
    this.createTasks();
  },
  methods: {
    
    createMatrixDates() {
      for (let i = 0; i < this.yearsRange.length; i++) {
        let year = { year: this.yearsRange[i], months: [] };
        for (let month = 0; month < 12; month++) {
          const monthArray = [];
          for (
            let day = 1;
            day <= new Date(year["year"], month + 1, 0).getDate();
            day++
          ) {
            const date = new Date(year["year"], month, day);
            if (date.getDay() != 0 && date.getDay() != 6) {
              monthArray.push(date);
            }
          }
          year["months"].push(monthArray);
        }
        this.years.push(year);
      }
    },

    createHeaderMonths() {
      const months = [];

      for (let i = 0; i < this.years.length; i++) {
        for (let j = 0; j < 12; j++) {
          const month = new Date(this.years[i].year, j).toLocaleString(
            "default",
            {
              month: "long",
            }
          );
          const capitalizedMonth =
            month.charAt(0).toUpperCase() + month.slice(1);
          const monthDays = new Date(this.years[i].year, j + 1, 0).getDate();
          let weekends = 0;
          for (let k = 1; k <= monthDays; k++) {
            const date = new Date(this.years[i].year, j, k);
            if (date.getDay() == 0 || date.getDay() == 6) {
              weekends++;
            }
          }
          const width = (monthDays - weekends) * 19;
          months.push({ name: capitalizedMonth, width: width });
        }
      }
      this.months = months;
    },

    createHeader() {
        const lastDaysOfTheMonth = this.$refs.datesTransforming.findLastDaysOfTheMonth();
      const divHeader = document.createElement("div");
      divHeader.classList.add("header");
      for (let i = 0; i < this.years.length; i++) {
        const year = this.years[i];
        for (let j = 0; j < year.months.length; j++) {
          const month = year.months[j];
          for (let k = 0; k < month.length; k++) {
            const day = month[k];
            const dayElement = document.createElement("div");
            dayElement.classList.add("day-header");
            dayElement.setAttribute("data-index", day.getDate());
            dayElement.textContent = day.getDate();
            if (day.getDate() == lastDaysOfTheMonth[j]) {
              dayElement.classList.add("last-day");
            }
            const today = new Date();
            if (
              day.getDate() === today.getDate() &&
              month[0].getMonth() === today.getMonth() &&
              year.year === today.getFullYear()
            ) {
              dayElement.classList.add("today");
            }
            divHeader.appendChild(dayElement);
          }
          const monthBorder = document.createElement("div");
          monthBorder.classList.add("month-border");
          divHeader.appendChild(monthBorder);
        }
      }
      const grid = document.querySelector(".grid");
      grid.appendChild(divHeader);
    },

    createTasks() {
      axios
        .get("http://localhost:8000/read_task/")
        .then((response) => {
          for (let i = 0; i < response.data.tasks.length; i++) {
            let task = response.data.tasks[i];
            this.drawTasks(task); // pasamos la tarea actual como argumento
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    drawTasks(task) {
      const today = new Date();
      let taskDays = [];
      for (let j = 0; j < this.years.length; j++) {
        for (let k = 0; k < this.years[j].months.length; k++) {
          let month = this.years[j].months[k];
          for (let l = 0; l < month.length; l++) {
            let day = month[l];
            day.dateString = new Date(
              this.years[j].year,
              k,
              l + 1
            ).toDateString();
            taskDays.push(day);
          }
        }
      }
      this.matrix.push(taskDays);
      let div_task = document.createElement("div");
      div_task.setAttribute("class", "task");
      div_task.setAttribute("data-position", task.position);
      div_task.setAttribute("data-id", task.id);
      for (let j = 0; j < this.matrix[this.matrix.length - 1].length; j++) {
        // usamos this.matrix.length - 1 para acceder a la última tarea agregada
        let day = this.matrix[this.matrix.length - 1][j]; // usamos this.matrix.length - 1 para acceder a la última tarea agregada
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("data-date", this.$refs.datesTransforming?.parseDate(day) || '');

        cell.innerHTML = "&nbsp;";

        if (
          day.getDate() === today.getDate() &&
          day.getMonth() === today.getMonth() &&
          day.getFullYear() === today.getFullYear()
        ) {
          cell.classList.add("today"); // si el día coincide con hoy, agregamos la clase 'today'
        }

        div_task.appendChild(cell);
      }

      div_task.addEventListener("mousemove", () => {
        div_task.classList.add("hovered");
      });
      div_task.addEventListener("mouseleave", () => {
        div_task.classList.remove("hovered");
      });
      document.getElementById("grid")?.appendChild(div_task);
    },
  },
};
</script>



<style>

</style>