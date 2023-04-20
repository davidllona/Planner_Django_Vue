<template>
  <div>
    <div class="navbar"></div>
    <div class="tasks-container ui-sortable" id="task_list">
      <div class="tasks-header"><span class="titulo">Tarea</span></div>
    </div>
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
    this.getPeriods();
    this.listenToCreatePeriods();
    this.drawPeriodTasks();
    this.listenToMoveRight();
    this.listenToMoveLeft();
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

    getPeriods() {
      document.addEventListener("DOMContentLoaded", function () {
        fetch("http://localhost:8000/get-periods/")
          .then((response) => response.json())
          .then((data) => {
            data.periods.forEach((period) => {
              const taskElements = document.querySelectorAll(
                `.task[data-id="${period.task_id}"]`
              );
              const cell = Array.from(taskElements)
                .map(
                  (taskElement) =>
                    taskElement.querySelectorAll(
                      `.cell[data-date="${period.start}"]`
                    )[0]
                )
                .filter((cellElement) => cellElement)[0];

              if (cell) {
                const start = new Date(period.start);
                const end = new Date(period.end);
                const cells = taskElements[0].querySelectorAll(".cell");
                cells.forEach((cellElement) => {
                  const cellDate = new Date(cellElement.dataset.date);
                  if (cellDate >= start && cellDate <= end) {
                    cellElement.classList.add("occupied");
                  }
                });

                const periodDiv = document.createElement("div");
                periodDiv.classList.add("period", "resizable");
                periodDiv.style.backgroundColor = period.color;
                periodDiv.dataset.id = period.id;
                periodDiv.dataset.startDay = period.start;
                periodDiv.dataset.endDay = period.end;
                periodDiv.dataset.position = taskElements[0].dataset.position;

                const cellWidth = cell.offsetWidth;

                const startCellIndex = Array.from(cells).indexOf(cell);
                const endCellIndex = Array.from(cells).findIndex(
                  (cellElement) => cellElement.dataset.date === period.end
                );
                const numCells = endCellIndex - startCellIndex + 1;
                const width = numCells * cellWidth - 1;
                periodDiv.style.width = width + "px";

                cell.appendChild(periodDiv);
              }
            });
          })
          .catch((error) => {
            console.log("Error retrieving periods data." + error);
          });
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
        cell.setAttribute("data-date", this.parseDate(day));
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

    drawPeriodTasks() {
      axios
        .get("http://localhost:8000/read_task/")
        .then((response) => {
          for (let i = 0; i < response.data.tasks.length; i++) {
            let task = response.data.tasks[i];
            let div_period_tasks = document.createElement("div");
            div_period_tasks.setAttribute("class", "tasks-periods");
            div_period_tasks.setAttribute("data-id", task.id);
            div_period_tasks.setAttribute("data-position", task.position);
            div_period_tasks.innerHTML = `<span class='task-name'>${task.name}</span>`;

            div_period_tasks.addEventListener("mousedown", function () {
              if (event.button === 0) {
                // left mouse button
                event.preventDefault();
                this.setAttribute("contenteditable", "true");
                this.focus();
                const textLength = this.textContent.length;
                const sel = window.getSelection();
                const range = document.createRange();
                range.setStart(sel.focusNode, textLength);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                this.style.cursor = "move";
              }
            });

            div_period_tasks.addEventListener("mouseup", function () {
              this.style.cursor = "auto";
            });

            // Get the task ID from the data-id attribute

            let task_id = div_period_tasks.getAttribute("data-id");
            // Attach an event listener to update the task name when the user edits the div
            div_period_tasks.addEventListener("input", function () {
              let taskRowName = this.textContent;

              console.log(task_id);
              axios
                .post("http://localhost:8000/update_task_name/", {
                  id: task_id,
                  name: taskRowName,
                })
                .then((response) => {
                  console.log(response.data.message);
                })
                .catch((error) => {
                  console.log(error);
                });
            });

            document
              .querySelector(".tasks-container")
              .appendChild(div_period_tasks);
          }
          this.sortTaskperiods();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    sortTaskperiods() {
      //Iplementar
    },

    listenToCreatePeriods() {
      console.log(document);
      document.addEventListener("click", function (event) {
        if (
          event.target.matches(".cell") &&
          !event.target.querySelector(".period")
        ) {
          let dayIndex = event.target.getAttribute("data-date");
          let currentTask = event.target.parentElement.getAttribute("data-id");
          let data = {
            name: "", // vacio por defecto
            color: "blue", // blue por defecto
            start: dayIndex,
            end: dayIndex, // igual al start por defecto
            task_id: currentTask,
          };
          console.log(data);
          axios
            .post("http://localhost:8000/create-period/", data)
            .then(() => {
              let period = document.createElement("div");
              period.setAttribute("class", "period resizable");
              period.innerHTML = `<span class='left-span'></span><span draggable='true' class='center-span drag-handle'></span><span class='right-span'></span>`;
              period.setAttribute("data-day-start", dayIndex);
              period.setAttribute("data-color", "blue"); // set the default color
              event.target.appendChild(period);
              this.dragAndDrop();
            })
            .catch((error) => {
              console.log(error.response.data);
            });
        }
      });
    },

    dragAndDrop() {
      // Algo
    },

    listenToMoveRight() {
      // implementar
    },
    listenToMoveLeft() {
      // implementar
    },

    menu() {
      // implementar
    },

    addDaysToDate(startDate, numDays) {
      let endDate = new Date(startDate);
      let numWeekendDays = 0;
      while (numDays > 0) {
        endDate.setDate(endDate.getDate() + 1);
        if (endDate.getDay() === 6 || endDate.getDay() === 0) {
          numWeekendDays = numWeekendDays + 1;
        } else {
          numDays--;
        }
      }
      return endDate.toISOString().substring(0, 10);
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
