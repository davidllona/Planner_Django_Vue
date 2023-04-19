<template>
  <div>
    <div class="navbar"></div>
    <div class="tasks-container ui-sortable" id="task_list">
      <div class="tasks-header"><span class="titulo">Tarea</span></div>
    </div>
    <div class="grid" id="grid">
      <div class="header-months">
        <div class="month-header" v-for="(month, index) in months" :key="index" :style="{ width: month.width + 'px' }">
          {{ month.name }}
        </div>
      </div>
    </div>

    <button class="add-task">Agregar fila</button>
    <button class="add-task">Agregar Tarea</button>
    <div id="context-menu" style="display: none">
      <ul>
        <li id="delete-period">Borrar</li>
        <li id="change-color">
          Cambiar Color
          <input id="color-picker" type="color" />
        </li>
        <li id="create-interrelation">Crear interrelación</li>
      </ul>
    </div>
    <footer>
      <div class="footer"></div>
    </footer>
  </div>
</template>


<script>
import axios from "axios";

export default {
  watch: {},
  name: "App",
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
    this.drawPeriodTasks();
    this.listenToMoveRight();
    this.listenToMoveLeft();
    this.listenToCreatePeriods();
    this.getPeriods();
    this.menu();
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
      const lastDaysOfTheMonth = this.findLastDaysOfTheMonth();
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
          const monthElement = {
            name: capitalizedMonth,
            width: width + lastDaysOfTheMonth[i],
          };
          months.push(monthElement);
        }
      }
      this.months = months;
    },

    createHeader() {
      const lastDaysOfTheMonth = this.findLastDaysOfTheMonth();
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
              this.years[j].year,k,l + 1).toDateString();
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
        cell.setAttribute("data-date", this.parseDate(day));

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

    drawPeriodTasks() {
      // implementar
    },
    listenToMoveRight() {
      // implementar
    },
    listenToMoveLeft() {
      // implementar
    },
    listenToCreatePeriods() {
      // implementar
    },
    getPeriods() {
      // implementar
    },
    menu() {
      // implementar
    },

    findLastDaysOfTheWeek() {
      const lastDayOfWeek = [];
      for (let i = 0; i < this.years.length; i++) {
        let year = this.years[i];
        for (let j = 0; j < year.months.length; j++) {
          let month = year.months[j];
          let lasDayOfMonth = month[month.length - 1];
          for (let k = 0; k < month.length; k++) {
            let day = month[k];
            if (day.getDay() === 5 || day === lasDayOfMonth) {
              if (day.getDay() === 5) {
                lastDayOfWeek.push(day.getDate());
              }
            }
          }
        }
      }
      return lastDayOfWeek;
    },

    findLastDaysOfTheMonth() {
      let lastDaysOfMonth = [];
      for (let i = 0; i < this.years.length; i++) {
        let year = this.years[i];
        for (let j = 0; j < year.months.length; j++) {
          let month = year.months[j];
          let lastDayOfMonth = month[month.length - 1];
          lastDaysOfMonth.push(lastDayOfMonth.getDate());
        }
      }
      return lastDaysOfMonth;
    },

    parseDate(dateString) {
      const dateObj = new Date(dateString);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const day = dateObj.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>
<style src="../../static/style.css"></style>
