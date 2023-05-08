<template>
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
  <DatesTransforming ref="datesTransforming"></DatesTransforming>
  </template>
  
  <script>
  import axios from "axios";
  import  DatesTransforming  from  "./DatesTools.vue";
  export default{
    name: "PeriodManipulate",
    components: {
      DatesTransforming
    },
    mounted() {
      this.listenToCreatePeriods();
      this.listenToMoveRight();
      this.listenToMoveLeft();
      this.menu();
    },
    methods: {
      listenToCreatePeriods() {
        document.addEventListener("click", function (event) {
          if (event.target.classList.contains("cell")) {
            if (!event.target.querySelector(".period")) {
              let dayIndex = event.target.dataset.date;
              let currentTask = parseInt(event.target.parentNode.dataset.id);
              console.log(currentTask);
              let data = {
                name: "", // vacío por defecto
                color: "blue", // blue por defecto
                start: dayIndex,
                end: dayIndex, // igual al start por defecto
                task_id: currentTask, // ninguna tarea por defecto
              };
              console.log(data);
              axios
                .post("http://localhost:8000/create-period/", data)
                .then(() => {
                  let period = document.createElement("div");
                  period.classList.add("period", "resizable");
                  period.innerHTML =
                    "<span class='left-span'></span><span  draggable='true' class='center-span drag-handle'></span><span class='right-span'></span>";
                  period.dataset.dayStart = dayIndex;
                  period.dataset.color = "blue";
                  event.target.appendChild(period);
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }
        });
        this.dragAndDrop();
      },
  
      dragAndDrop() {
        //Revisar este codigo
        let currentDraggingPeriod = null;
  
        document.addEventListener("dragstart", (event) => {
          const period = event.target.closest(".period .center-span");
          if (period) {
            currentDraggingPeriod = period.closest(".period");
            let position = currentDraggingPeriod.getAttribute("data-position");
            event.dataTransfer.setData("text", position);
          }
        });
  
        document.addEventListener("dragover", (event) => {
          event.preventDefault();
        });
  
        document.addEventListener("dragenter", (event) => {
          event.preventDefault();
        });
  
        document.addEventListener("drop", (event) => {
          event.preventDefault();
  
          // If the cell is occupied, return the task to its previous position
          if (event.target.classList.contains("occupied")) {
            return;
          }
  
          const cell = event.target.closest(".cell");
          if (cell) {
            let currentperiod = cell.parentElement.getAttribute("data-position");
            let sourceperiod = currentDraggingPeriod.getAttribute("data-position");
            currentDraggingPeriod.setAttribute("data-position", currentperiod);
            currentDraggingPeriod.remove();
            cell.appendChild(currentDraggingPeriod);
            console.log("Current Position: " + currentperiod);
            console.log("Source Position: " + sourceperiod);
  
            let taskperiod = document.querySelector(`.tasks-periods[data-position="${sourceperiod}"]`);
            let currentPeriod = cell.querySelector(".period");
            let currentStart = new Date(currentPeriod.getAttribute("data-start-day"));
            let currentEnd = new Date(currentPeriod.getAttribute("data-end-day"));
  
            console.log("CurrentStart: " + currentStart);
            console.log("CurrentEnd: " + currentEnd);
  
            let newPeriod = document.querySelector(`.task[data-position="${currentperiod}"] .period`);
            let newStart = new Date(newPeriod.getAttribute("data-start-day"));
            currentStart = newStart;
  
            taskperiod.remove();
            if (currentperiod < sourceperiod) {
              document.querySelector(`.tasks-periods[data-position="${currentperiod}"]`).before(taskperiod);
            } else {
              document.querySelector(`.tasks-periods[data-position="${currentperiod}"]`).after(taskperiod);
            }
            taskperiod.setAttribute("data-position", currentperiod);
  
            let taskperiods = document.querySelectorAll(".tasks-periods");
            taskperiods.forEach((periods, i) => {
              periods.setAttribute("data-position", i + 1);
              let periodsList = periods.querySelectorAll(".period");
              periodsList.forEach((period) => {
                period.setAttribute("data-position", i);
              });
            });
  
            let period = currentDraggingPeriod;
            let dayStart = cell.getAttribute("data-position");
            period.setAttribute("data-day-start", dayStart);
  
            //Esto cuando se mueve el period si se actualiza el id
            let period_id = period.getAttribute("data-id");
            console.log("Id del period: " + period_id);
            let new_task_id = cell.closest(".task").getAttribute("data-id");
            console.log("Id del task: " + new_task_id);
            let new_start_date = new Date(cell.getAttribute("data-date"));
            console.log("El dia inical actualizado es: " + new_start_date);
          }
        });
  
        document.addEventListener("dragend", () => {
          currentDraggingPeriod = null;
        });
      },
  
      listenToMoveRight() {
        document.addEventListener("mousedown", (event) => {
          if (event.target.classList.contains("right-span")) {
            let activeRedDiv = event.target.closest(".period");
            activeRedDiv.classList.add("active-right");
            let startPosition = event.pageX;
            let startWidth = activeRedDiv.offsetWidth;
            let newWidth = 0;
            let startDay = activeRedDiv.getAttribute("data-start-day");
            let currentDay = new Date(activeRedDiv.getAttribute("data-end-day"));
  
            // Actualiza startDay si el período ya ha sido estirado antes
            if (
              activeRedDiv.getAttribute("data-start-day") !==
              activeRedDiv.getAttribute("data-end-day")
            ) {
              startDay = currentDay.toISOString().substring(0, 10);
            }
  
            const mousemoveHandler = (event) => {
              let distance = event.pageX - startPosition;
              let distanceInCells = Math.round(
                distance / document.querySelector(".cell").offsetWidth
              );
  
              // Calcula la nueva anchura de la barra
              newWidth = startWidth + distanceInCells * 20;
  
              // Si la nueva anchura es menor que la anchura actual y tiene menos de 19px, ajusta la fecha final para que sea igual a la fecha de inicio
              if (newWidth < startWidth && newWidth <= 19) {
                newWidth = 19;
                activeRedDiv.setAttribute("data-end-day", startDay);
                activeRedDiv.style.width = `${newWidth}px`;
                return;
              }
  
              let isBlocked = false;
              let nextRedDivPosition = activeRedDiv.offsetLeft + newWidth;
  
              // Comprueba si hay otro período en el mismo task
              document.querySelectorAll(".period").forEach((el) => {
                if (
                  el.getAttribute("data-task-id") ===
                    activeRedDiv.getAttribute("data-task-id") &&
                  el.offsetTop === activeRedDiv.offsetTop &&
                  el.offsetLeft > activeRedDiv.offsetLeft &&
                  el.offsetLeft < nextRedDivPosition
                ) {
                  isBlocked = true;
                  return false;
                }
              });
  
              if (!isBlocked) {
                let newEndDay =  this.$refs.datesTransforming.addDaysToDate(startDay, distanceInCells);
                console.log(this.$refs.datesTransforming.addDaysToDate(startDay, distanceInCells))
  
                const mouseupHandler = () => {
                  // Actualiza el campo 'end' del objeto 'period' en la base de datos al soltar el click
                  axios
                    .post(
                      `http://localhost:8000/update_period_end/${activeRedDiv.dataset.id}/`,
                      {
                        end: newEndDay,
                      }
                    )
                    .then((response) => {
                      if (response.data.success) {
                        console.log("Period end updated successfully.");
                      } else {
                        console.log("Failed to update period end.");
                      }
                    })
                    .catch((error) => console.log(error));
  
                  document.removeEventListener("mousemove", mousemoveHandler);
                  document.removeEventListener("mouseup", mouseupHandler);
                };
  
                document.addEventListener("mouseup", mouseupHandler);
  
                activeRedDiv.setAttribute("data-end-day", newEndDay);
                activeRedDiv.style.width = `${newWidth}px`;
              }
  
              currentDay = new Date(activeRedDiv.getAttribute("data-end-day"));
            };
  
            document.addEventListener("mousemove", mousemoveHandler);
          }
        });
      },
  
      listenToMoveLeft() {
        /* eslint-disable */
        function handleMouseDown(event) {
          if (event.target.classList.contains("left-span")) {
            let activePeriod = event.target.closest(".period");
            activePeriod.classList.add("active-left");
  
            let startPosition = event.pageX;
            let startWidth = activePeriod.offsetWidth;
            let startLeft = activePeriod.offsetLeft;
            let endLeft;
            let startDay = new Date(activePeriod.dataset.startDay);
            let endDay = new Date(activePeriod.dataset.endDay);
  
            function handleMouseMove(event) {
              let distance = startPosition - event.pageX;
              let distanceInCells = Math.floor(
                distance / document.querySelector(".cell").offsetWidth
              );
              let newWidth = startWidth + distanceInCells * 20;
              if (newWidth < 20) {
                newWidth = 20;
              }
  
              // Calculate new left position based on the number of cells moved
              endLeft =
                startLeft -
                distanceInCells * document.querySelector(".cell").offsetWidth;
              if (newWidth === 20) {
                endLeft = startLeft + startWidth - 20;
              }
  
              // Calculate the new start date of the period
              let newStartDay = new Date(startDay);
              let daysToSubtract = 0;
              while (daysToSubtract < Math.abs(distanceInCells)) {
                newStartDay.setDate(newStartDay.getDate() - 1);
                if (newStartDay.getDay() !== 0 && newStartDay.getDay() !== 6) {
                  daysToSubtract++;
                }
              }
  
              // Verify that the new start date is less than the end date
              if (newStartDay.getTime() < endDay.getTime()) {
                activePeriod.style.width = newWidth + "px";
                activePeriod.style.left = endLeft + "px";
                activePeriod.dataset.startDay = newStartDay
                  .toISOString()
                  .substring(0, 10);
  
                axios
                  .post(
                    `http://localhost:8000/update_period_start/${activePeriod.dataset.id}/`,
                    {
                      start: newStartDay.toISOString().substring(0, 10),
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then((response) => response.data)
                  .then((data) => {
                    if (data.success) {
                      console.log("Period start updated successfully.");
                    } else {
                      console.log("Failed to update period start.");
                    }
                  })
                  .catch((error) => {
                    console.error("Error updating period start:", error);
                  });
              }
            }
  
            function handleMouseUp() {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            }
  
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
          }
        }
  
        document.addEventListener("mousedown", handleMouseDown);
      },
      
      menu() {
        document.addEventListener("contextmenu", function (e) {
          e.preventDefault();
          let period = e.target.closest(".period");
          if (!period) return;
          let menu = document.querySelector("#context-menu");
          menu.dataset.task = period.dataset.id;
          let colorPicker = menu.querySelector("#color-picker");
          colorPicker.removeEventListener("change", onChangeColor);
          colorPicker.addEventListener("change", onChangeColor);
  
          function onChangeColor() {
            let color = colorPicker.value;
            axios
              .post(
                `http://localhost:8000/update-period-color/${period.dataset.id}/`,
                { color }
              )
              .then(() => {
                period.style.backgroundColor = color;
                menu.style.display = "none";
              })
              .catch(() => {
                alert("Error al actualizar el color del período");
              });
          }
  
          menu.style.left = `${e.pageX}px`;
          menu.style.top = `${e.pageY}px`;
          menu.style.display = "block";
        });
  
        document.addEventListener("click", function (e) {
          let target = e.target;
          let menu = document.querySelector("#context-menu");
          if (target.matches("#delete-period")) {
            let periodId = menu.dataset.task;
            if (periodId) {
              axios
                .delete(`http://localhost:8000/delete-period/${periodId}/`)
                .then((response) => {
                  console.log(response.data.message);
                  let period = document.querySelector(
                    `.period[data-id="${periodId}"]`
                  );
                  if (period) period.remove();
                  menu.style.display = "none";
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else if (!target.closest("#context-menu")) {
            menu.style.display = "none";
          }
        });
  
        // document.querySelector("#create-interrelation").addEventListener("click", createInterrelation);
      },
    },
  };
  </script>
  
  
  <style src="../assets/style.css"></style>
   
  