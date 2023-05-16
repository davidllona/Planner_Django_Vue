<template>
 <div>
  <div class="navbar"></div>
  <div class="tasks-container ui-sortable" id="task_list">
   <div class="tasks-header"><span class="titulo">Tarea</span></div>
  </div>
  <!-- Grid -->
  <GridPlanner></GridPlanner>
  <!------------------->
  <button class="add-task">Agregar fila</button>
  <button class="add-task">Agregar Tarea</button>
  <PeriodManipulate></PeriodManipulate>
  <footer>
   <div class="footer"></div>
  </footer>
 </div>
</template>

<script>
import axios from "axios";
import Sortable from "sortablejs";
import GridPlanner from "./Grid.vue";
import PeriodManipulate from "./Period.vue";
export default {
 components: {
  GridPlanner,
  PeriodManipulate,
 },
 name: "PlannerVue",

 mounted() {
  this.getPeriods();
  this.drawPeriodTasks();
 },
 methods: {
  getPeriods() {
   axios
    .get("http://localhost:8000/get-periods/")
    .then((response) => {
     const data = response.data;
     data.periods.forEach((period) => {
      const taskElements = document.querySelectorAll(`.task[data-id="${period.task_id}"]`);
      const cell = Array.from(taskElements)
       .map((taskElement) => taskElement.querySelectorAll(`.cell[data-date="${period.start}"]`)[0])
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

       const leftSpan = document.createElement("span");
       leftSpan.classList.add("left-span");
       periodDiv.appendChild(leftSpan);

       const centerSpan = document.createElement("span");
       centerSpan.classList.add("center-span", "drag-handle");
       centerSpan.setAttribute("draggable", "true");
       centerSpan.setAttribute("contenteditable", "true");
       centerSpan.textContent = period.name;

       centerSpan.addEventListener("input", function () {
        let periodName = this.textContent.trim();
        let period_id = periodDiv.dataset.id; // retrieve the period_id from the periodDiv dataset
        axios
         .post("http://localhost:8000/update_period_name/", {
          id: period_id,
          name: periodName,
         })
         .then((response) => {
          console.log(response.data.message);
         })
         .catch((error) => {
          console.log(error);
         });
       });
       // Set text color based on background color brightness
       const periodColor = period.color;
       const brightness = this.getBrightness(periodColor);
       if (brightness > 127.5) {
        centerSpan.style.color = "black"; // Use black text color for bright background
       } else {
        centerSpan.style.color = "white"; // Use white text color for dark background
       }
       periodDiv.appendChild(centerSpan);

       const rightSpan = document.createElement("span");
       rightSpan.classList.add("right-span");
       periodDiv.appendChild(rightSpan);

       periodDiv.style.backgroundColor = period.color;
       periodDiv.dataset.id = period.id;
       periodDiv.dataset.startDay = period.start;
       periodDiv.dataset.endDay = period.end;
       periodDiv.dataset.position = taskElements[0].dataset.position;

       const cellWidth = cell.offsetWidth;

       const startCellIndex = Array.from(cells).indexOf(cell);
       const endCellIndex = Array.from(cells).findIndex((cellElement) => cellElement.dataset.date === period.end);
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
  },
  
  // Function to calculate brightness based on color
  getBrightness(color) {
   const rgb = color.substring(1); // Remove the leading #
   const r = parseInt(rgb.substring(0, 2), 16);
   const g = parseInt(rgb.substring(2, 4), 16);
   const b = parseInt(rgb.substring(4, 6), 16);

   const brightness = (r + g + b) / 3;

   return brightness;
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

      document.querySelector(".tasks-container").appendChild(div_period_tasks);
     }
     this.sortTaskperiods();
    })
    .catch((error) => {
     console.log(error);
    });
  },

  sortTaskperiods() {
   const tasksContainer = document.querySelector(".tasks-container");

   new Sortable(tasksContainer, {
    axis: "y",
    containment: "parent",
    onUpdate: function () {
     const taskPeriods = document.querySelectorAll(".tasks-periods");
     let newMatrix = [];
     let periodsToMove = [];

     taskPeriods.forEach((taskPeriod, i) => {
      const task_id = taskPeriod.dataset.id;
      const task_position = i + 1;
      newMatrix.push(matrix[task_id]);

      const task = document.querySelector(`.task[data-id='${task_id}']`);
      task.after(document.querySelector(`.task:nth-child(${i + 1})`));
      taskPeriod.after(document.querySelector(`.tasks-periods:nth-child(${i + 1})`));

      const taskCells = task.querySelectorAll(".cell");
      taskCells.forEach((taskCell) => {
       taskCell.dataset.position = `${task_position}-${taskCell.dataset.cell}`;
      });

      const periods = document.querySelectorAll(`.period[data-task-id='${task_id}']`);
      periods.forEach((period) => {
       const period_position = period.dataset.position;
       periodsToMove.push({
        period: period,
        newPosition: `${task_position}-${period_position.split("-")[1]}`,
       });
      });

      task.dataset.position = task_position;

      // Update the position of the task in the database
      axios
       .post("/update_task_position/", {
        id: task_id,
        position: task_position,
       })
       .then((response) => {
        console.log(response.data.message);
       })
       .catch((error) => {
        console.log(error);
       });
     });

     // Define matrix variable
     let matrix = newMatrix;

     const tasks = document.querySelectorAll(".tasks");

     taskPeriods.forEach((taskPeriod, i) => {
      taskPeriod.dataset.position = i + 1;
      tasks[i].dataset.position = i + 1;

      const currentperiod = i + 1;
      const periods = tasks[i].querySelectorAll(".period");
      periods.forEach((period) => {
       period.dataset.position = `${currentperiod}-${period.dataset.cell}`;
      });
     });

     periodsToMove.forEach((periodData) => {
      periodData.period.dataset.position = periodData.newPosition;
     });

     taskPeriods.forEach((taskPeriod, i) => {
      taskPeriod.dataset.position = i + 1;
     });
    },
   });
  },
 },
};
</script>
<style src="../assets/style.css"></style>
