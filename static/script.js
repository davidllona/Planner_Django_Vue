let matrix = [];
const years = [];
let yearsRange = [2023, 2024];


$(document).ready(function () {
  createMatrixDates(yearsRange);
  createHeaderMonths();
  createHeader();
  createTasks();
  drawPeriodTasks();
  listenToMoveRight();
  listenToMoveLeft();
  // drawNewTask();
  listenToCreatePeriods();
  getPeriods();
  menu();
});

function createMatrixDates(yearsRange) {
  for (let i = 0; i < yearsRange.length; i++) {
    let year = { year: yearsRange[i], months: [] };
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
    years.push(year);
  }
  return years;


}

function createHeaderMonths() {
  let years = [{ year: 2023 }, { year: 2024 }];

  let months = [];

  for (let i = 0; i < years.length; i++) {
    for (let j = 0; j < 12; j++) {
      const month = new Date(years[i].year, j).toLocaleString("default", {
        month: "long",
      });
      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
      months.push(capitalizedMonth);
    }
  }
  let div_header = $("<div class='header-months'>");
  let ultimosDiasMes = findLastDaysOfTheMonth();
  months.forEach((month, index) => {
    const monthDays = new Date(years[0].year, index + 1, 0).getDate();
    let weekends = 0;
    for (let i = 1; i <= monthDays; i++) {
      const date = new Date(years[0].year, index, i);
      if (date.getDay() == 0 || date.getDay() == 6) {
        weekends++;
      }
    }
    const width = (monthDays - weekends) * 19;
    const $monthElement = $(
      "<div class='month-header' style='width: " + width + "px'>" + month + "</div>"
    );
    div_header.append($monthElement);
  });
  $(".month-header").each(function (index) {
    $(this).css("width", (ultimosDiasMes[index] + 1) * 20 + "px");
  });

  $(".grid").append(div_header);
}

function createHeader() {
  let div_header = $("<div class='header'>");
  for (let i = 0; i < years.length; i++) {
    let year = years[i];
    for (let j = 0; j < year.months.length; j++) {
      let month = year.months[j];
      for (let k = 0; k < month.length; k++) {
        let day = month[k];
        let $dayElement = $("<div class='day-header' data-index='" + day.getDate() + "'>" + day.getDate() + "</div>");
        if (day.getDate() == findLastDaysOfTheMonth()[j]) {
          $dayElement.addClass("last-day");
        }
        const today = new Date();
        if (
          day.getDate() === today.getDate() &&
          month[0].getMonth() === today.getMonth() &&
          year.year === today.getFullYear()
        ) {
          $dayElement.addClass("today");
        }
        div_header.append($dayElement);
      }
      $("<div class='month-border'></div>").appendTo(div_header);
    }
  }
  $(".grid").append(div_header);
}

function createTasks() {  
  $.ajax({
    url: '/read_task',
    success: drawTasks
  });
}

function drawTasks(response) {
  console.log(response.tasks);
  const today = new Date(); 
  for (let i = 0; i < response.tasks.length; i++) {
    let task = response.tasks[i];
    let taskDays = [];
    for (let j = 0; j < years.length; j++) {
      for (let k = 0; k < years[j].months.length; k++) {
        let month = years[j].months[k];
        for (let l = 0; l < month.length; l++) {
          let day = month[l];
          day.dateString = new Date(years[j].year, k, l + 1).toDateString();
          taskDays.push(day);
        }
      }
    }
    matrix.push(taskDays);
    let div_task = $("<div class='task'>");
    div_task.attr("data-position", task.position);
    div_task.attr("data-id", task.id);
    for (let j = 0; j < matrix[i].length; j++) {
      let day = matrix[i][j];
      let $cell = $("<div class='cell'  data-date='" + parseDate(day) + "'>&nbsp;</div>");
      
      if (day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear()) {
        $cell.addClass("today"); // si el día coincide con hoy, agregamos la clase 'today'
      }
      
      div_task.append($cell);
    }
    
    div_task.on("mousemove", function () {
      $(this).addClass("hovered");
    }).on("mouseleave", function () {
      $(this).removeClass("hovered");
    });
    $(".grid").append(div_task);
  }
}

function listenToCreatePeriods() {
  console.log(document);
  $(document).on("click", ".cell", function (event) {
    
    if ($(this).find(".period").length === 0) {
      let dayIndex = $(this).attr("data-date");
      let currentTask = $(this).parent().attr("data-id");
      let data = {
        'name': '', // vacio por defecto
        'color': 'blue', // blue por defecto
        'start': dayIndex,
        'end': dayIndex, // igual al start por defecto
        'task_id': currentTask,
      };
      $.ajax({
        url: '/create-period/',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (response) {
          let period = $("<div class='period resizable'><span class='left-span'></span><span  draggable='true' class='center-span drag-handle'></span><span class='right-span'></span></div>");
          period.attr("data-day-start", dayIndex);
          period.attr("data-color", "blue"); // set the default color
          $(event.target).append(period);
          
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
        },
      });
    }
  });

  dragAndDrop();
}

function menu() {
  $(document).on("contextmenu", ".period", function (e) {
    e.preventDefault();
    let period = $(this);
    let menu = $("#context-menu");
    menu.data("task", period);
    menu
      .find("#color-picker")
      .off()
      .on("change", function () {
        let color = $(this).val();
        $.ajax({
          url: `/update-period-color/${period.data("id")}/`,
          method: 'POST',
          data: {'color': color},
          success: function () {
            period.css("background-color", color);
            $("#context-menu").hide();
          },
          error: function () {
            alert('Error al actualizar el color del período');
          }

          
        });
      });
    menu.css({ left: e.pageX, top: e.pageY });
    menu.show();
  });
  
  $(document).one("click", "#delete-period", function () {
    let period = $("#context-menu").data("task");
    let periodId = period.data("id");
    if (periodId) { // Verificar si el periodo tiene un id
      $.ajax({
        url: `/delete-period/${periodId}/`,
        method: 'DELETE',
        success: function (response) {
            console.log(response.message);
            period.remove();
            $("#context-menu").hide();
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
      });
    }
  });
  

  $(document).on("click", function (e) {
    if (!$(e.target).is("#context-menu, #context-menu *")) {
      $("#context-menu").hide();
    }
  });
  $(document).on("click", "#create-interrelation", function () {
    // createInterrelation();                                   
  });
}

function getPeriods() {  
  $(document).ready(function() {
    $.ajax({
      url: "/get-periods/",
      type: "GET",
      dataType: "json",
      success: function(data) {
        // Agregar las tareas a las filas correspondientes
        $.each(data.periods, function(index, period) {
          // Buscar la tarea correspondiente
          let $task = $(".task[data-id='" + period.task_id + "']");
          // Buscar la celda correspondiente
          let $cell = $task.find(".cell[data-date='" + period.start + "']");

          let start = new Date(period.start);
          let end = new Date(period.end);
          // Buscar todas las celdas entre "start" y "end" y agregar la clase "occupied"
          $task.find(".cell").each(function() {
            let cellDate = new Date($(this).attr("data-date"));
            if (cellDate >= start && cellDate <= end) {
              $(this).addClass("occupied");
            }
          });
          
          // Crear el elemento period y agregar atributos
          let $period_div = $("<div class='period resizable'><span class='left-span'></span><span  draggable='true' class='center-span drag-handle'></span><span class='right-span'></span></div>");
          $period_div.css("background-color", period.color);
          $period_div.attr("data-id", period.id);
          $period_div.attr("data-start-day", period.start);
          $period_div.attr("data-end-day", period.end);
          $period_div.attr("data-position", $task.attr("data-position")); // Agregar atributo data-position con el valor correspondiente al task


          $cell.append($period_div);

          // Calcular el ancho del period
          let cellWidth = $(document).find(".cell").outerWidth();
          let startCellIndex = $cell.index();
          let endCellIndex = $task.find(".cell[data-date='" + period.end + "']").index();
          let numCells = endCellIndex - startCellIndex + 1;
          let width = numCells * cellWidth - 1;
          $period_div.css("width", width + "px");
        });
      },
      error: function() {
        console.log("Error retrieving periods data.");
      }
    });
  });
}

function updateTaskName(task_id, task_name) {
  $.ajax({
    url: '/update_task_name/',
    type: 'POST',
    data: {
      'id': task_id,
      'name': task_name
    },
    success: function (response) {
      console.log(response.message);
    },
    error: function (xhr, status, error) {
      console.log(error);
    }
  });
}

function drawPeriodTasks() {
  $.ajax({
    url: '/read_task',
    success: function (response) {
      for (let i = 0; i < response.tasks.length; i++) {
        let task = response.tasks[i];
        let div_period_tasks = $(`<div class='tasks-periods' data-id='${task.id}' data-position='${task.position}'><span class='task-name'>${task.name}</span></div>`);

        div_period_tasks.mousedown(function (event) {
          if (event.which == 1) {
            event.preventDefault();
            $(this).attr("contenteditable", "true");
            $(this).focus();
            const textLength = $(this).text().length;
            const sel = window.getSelection();
            const range = document.createRange();
            range.setStart(sel.focusNode, textLength);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            $(this).css("cursor", "move");
          }
        });
        div_period_tasks.mouseup(function (event) {
          $(this).css("cursor", "auto");
        });
        
        // Get the task ID from the data-id attribute
        let task_id = $(div_period_tasks).attr("data-id");
        
        // Attach an event listener to update the task name when the user edits the div
        div_period_tasks.on("input", function () {
          let taskRowName = $(this).text();
          $.ajax({
            url: '/update_task_name/',
            type: 'POST',
            data: {
              'id': task_id,
              'name': taskRowName
            },
            success: function (response) {
              console.log(response.message);
            },
            error: function (xhr, status, error) {
              console.log(error);
            }
          });
        });
        $(".tasks-container").append(div_period_tasks);
      }
      sortTaskperiods();
    }
  });
}

function sortTaskperiods() {
  $(".tasks-container").sortable({
    axis: "y",
    containment: "parent",
    update: function (event, ui) {
      let task_periods = $(".tasks-periods");
      let new_matrix = [];
      let periodsToMove = [];
      task_periods.each(function (i) {
        let task_id = $(this).attr("data-id");
        let task_position = i + 1;
        new_matrix.push(matrix[task_id]);
        let task = $(".task[data-id='" + task_id + "']");
        task.insertAfter($(".task:eq(" + i + ")"));
        $(this).insertAfter($(".tasks-periods:eq(" + i + ")"));
        // Update the position of the task in the grid
        let task_cells = $(".task[data-id='" + task_id + "'] .cell");
        task_cells.each(function (j) {
          $(this).attr("data-position", task_position + "-" + j);
        });
        // Save periods associated with the task
        let periods = $(".period[data-task-id='" + task_id + "']");
        periods.each(function (j) {
          let period_position = $(this).attr("data-position");
          periodsToMove.push({
            period: $(this),
            newPosition: task_position + "-" + period_position.split("-")[1],
          });
        });
        // Move the task as well
        let taskDiv = $(".task[data-id='" + task_id + "']");
        taskDiv.insertAfter($(".task:eq(" + i + ")"));
        // Update the position of the task in the grid
        taskDiv.attr("data-position", task_position);

        // Update the position of the task in the database
        $.ajax({
          url: '/update_task_position/',
          type: 'POST',
          data: {
            'id': task_id,
            'position': task_position
          },
          success: function (response) {
            console.log(response.message);
          },
          error: function (xhr, status, error) {
            console.log(error);
          }
        });
      });
      matrix = new_matrix;
      let tasks = $(".tasks");
      task_periods.each(function (i) {
        $(this).attr("data-position", i + 1);
        tasks.eq(i).attr("data-position", i + 1);
        let currentperiod = i + 1;
        let periods = tasks.eq(i).find(".period");
        periods.each(function (j) {
          $(this).attr("data-position", currentperiod + "-" + j);
        });
      });
      // Update positions of periods associated with the task
      periodsToMove.forEach(function (periodData) {
        periodData.period.attr("data-position", periodData.newPosition);
      });
      // Update data-position of task_periods
      task_periods.each(function (i) {
        $(this).attr("data-position", i + 1);
      });
    },
  });
}

function dragAndDrop() {
  let currentDraggingPeriod = null;
  $(document).on("dragstart", ".period .center-span", function (event) {
    currentDraggingPeriod = $(this).closest(".period");
    let position = currentDraggingPeriod.attr("data-position");
    event.originalEvent.dataTransfer.setData("text", position);
  });

  $(document).on("dragover", ".cell", function (event) {
    event.preventDefault();
  });

  $(document).on("dragenter", ".cell", function (event) {
    event.preventDefault();
  });

  $(document).on("drop", ".cell", function (event) {
    event.preventDefault();

    // If the cell is occupied, return the task to its previous position
    if ($(this).hasClass('occupied')) {
      return;
    }

    let currentperiod = $(this).parent().attr("data-position");
    let sourceperiod = currentDraggingPeriod.attr("data-position");
    currentDraggingPeriod.attr("data-position", currentperiod);
    currentDraggingPeriod.detach().appendTo($(this));
    console.log("Current Position: " + currentperiod);
    console.log("Source Position: " + sourceperiod);

      let taskperiod = $(".tasks-periods[data-position='" + sourceperiod + "']");
      let currentPeriod = $(this).find(".period");
      let currentStart = new Date(currentPeriod.attr("data-start-day"));
      let currentEnd = new Date(currentPeriod.attr("data-end-day"));

      console.log("CurrentStart: " + currentStart)
      console.log("CurrentEnd: " + currentEnd)

      let newPeriod = $(".task[data-position='" + currentperiod + "']").find(".period");
      let newStart = new Date(newPeriod.attr("data-start-day"));
      currentStart = newStart;

      taskperiod.detach();
      if (currentperiod < sourceperiod) {
        taskperiod.insertBefore($(".tasks-periods[data-position='" + currentperiod + "']"));
      } else {
        taskperiod.insertAfter($(".tasks-periods[data-position='" + currentperiod + "']"));
      }
      taskperiod.attr("data-position", currentperiod);

      let taskperiods = $(".tasks-periods");
      taskperiods.each(function (i) {
        $(this).attr("data-position", i + 1);
        let periods = $(this).find(".period");
        periods.each(function () {
          $(this).attr("data-position", i);
        });
      });

      let period = currentDraggingPeriod;

      
      let cell = period.closest(".cell");
      let dayStart = cell.attr("data-position");
      period.attr("data-day-start", dayStart);


      //Esto cuando se mueve el period si se actualiza el id
      let period_id = period.attr("data-id");
      console.log("Id del period: " + period_id)
      let new_task_id = $(this).closest(".task").attr("data-id");
      console.log("Id del task: " + new_task_id)
      let new_start_date = new Date($(this).closest(".cell").attr("data-date"));
      console.log("El dia inical actualizado es: " + new_start_date)
    
  });

  $(document).on("dragend", ".period", function (event) {
    currentDraggingPeriod = null;
  });
}

function getBusinessDaysCount(startDate, endDate) {
  let count = 0;
  let currentDate = new Date(startDate.getTime());
  while (currentDate <= endDate) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
}

// $.ajax({
      //   type: "POST",
      //   url: "/update_period/",
      //   data: {
      //     period_id: period_id,
      //     new_task_id: new_task_id,
      //     new_start_date: new_start_date,
      //     new_end_date: new_end_date,
      //   },
      //   success: function (response) {
      //     console.log(response);
      //   },
      // });


function drawNewTask() {
  $(".add-task").on("click", function () {
    let div_task = $("<div class='task'>");
    let taskIndex = matrix.length;
    div_task.attr("data-index", taskIndex);

    for (let j = 0; j < matrix[0].length; j++) {
      div_task.append("<div class='cell'>&nbsp;</div>");
    }

    $(".grid").append(div_task);

    let div_period_tasks = $("<div class='tasks-periods task-overflow ui-sortable-handle' contenteditable='true'></div>");
    div_period_tasks.attr("data-index", periodIndex);

    div_period_tasks.mousedown(function (event) {
      if (event.which == 1) {
        event.preventDefault();
        $(this).focus();
        $(this).css("cursor", "move");
      }
    });
    div_period_tasks.mouseup(function (event) {
      $(this).css("cursor", "auto");
    });
    $(".tasks-container").append(div_period_tasks);

    matrix.push(new Array(matrix[0].length).fill(""));
  });
}

function listenToMoveRight() {
  
  $(document).on("mousedown", ".period.resizable .right-span", function (event) {
    let activeRedDiv = $(this).parent(".period");
    activeRedDiv.addClass("active-right");
    let startPosition = event.pageX;
    let startWidth = activeRedDiv.outerWidth();
    let newWidth = 0;
    let startDay = activeRedDiv.attr("data-start-day");
    let currentDay = new Date(activeRedDiv.attr("data-end-day"));

    // Actualiza startDay si el período ya ha sido estirado antes
    if (activeRedDiv.attr("data-start-day") !== activeRedDiv.attr("data-end-day")) {
      startDay = currentDay.toISOString().substring(0, 10);
    }

    $(document).on("mousemove", function (event) {
      let distance = event.pageX - startPosition;
      let distanceInCells = Math.round(
        distance / $(document).find(".cell").outerWidth()
      );

      // Calcula la nueva anchura de la barra
      newWidth = startWidth + distanceInCells * 20;

      // Si la nueva anchura es menor que la anchura actual y tiene menos de 19px, ajusta la fecha final para que sea igual a la fecha de inicio
      if (newWidth < startWidth && newWidth <= 19) {
        newWidth = 19;
        activeRedDiv.attr("data-end-day", startDay);
        activeRedDiv.outerWidth(newWidth);
        return;
      }

      let isBlocked = false;
      let nextRedDivPosition = activeRedDiv.offset().left + newWidth;

      // Comprueba si hay otro período en el mismo task
      $(".period").each(function () {
        if (
          $(this).attr("data-task-id") === activeRedDiv.attr("data-task-id") &&
          $(this).offset().top === activeRedDiv.offset().top &&
          $(this).offset().left > activeRedDiv.offset().left &&
          $(this).offset().left < nextRedDivPosition
        ) {
          isBlocked = true;
          return false;
        }
      });

      if (!isBlocked) {
        let newEndDay = addDaysToDate(startDay, distanceInCells);

        $(document).on("mouseup", function () {
          // Actualiza el campo 'end' del objeto 'period' en la base de datos al soltar el click
          $.ajax({
            type: "POST",
            url: `/update_period_end/${activeRedDiv.data("id")}/`,
            data: {
              end: newEndDay,
            },
            success: function (response) {
              if (response.success) {
                console.log("Period end updated successfully.");
              } else {
                console.log("Failed to update period end.");
              }
            },
          });

          $(document).off("mousemove");
          $(document).off("mouseup");
        });

        activeRedDiv.attr("data-end-day", newEndDay);
        activeRedDiv.outerWidth(newWidth);
      }

      currentDay = new Date(activeRedDiv.attr("data-end-day"));
    });
  });
}


function listenToMoveLeft() {
  $(document).on("mousedown", ".period.resizable .left-span", function (event) {
      let activePeriod = $(this).parent(".period");
      activePeriod.addClass("active-left");
      let startPosition = event.pageX;
      let startWidth = activePeriod.outerWidth();
      let startLeft = parseInt(activePeriod.css("left"));
      let endLeft;
      let startDay = new Date(activePeriod.attr("data-start-day"));
      let endDay = new Date(activePeriod.attr("data-end-day"));

      $(document).on("mousemove", function (event) {
        let distance = startPosition - event.pageX;
        let distanceInCells = Math.floor(
          distance / $(document).find(".cell").outerWidth()
        );
        let newWidth = startWidth + distanceInCells * 20;
        if (newWidth < 20) {
          newWidth = 20;
        }
        endLeft = startLeft - distanceInCells * 20;
        if (newWidth === 20) {
          endLeft = startLeft + startWidth - 20;
        }

        // Calcula la nueva fecha inicial del período
        let newStartDay = new Date(startDay);
        let daysToSubtract = 0;
        while (daysToSubtract < Math.abs(distanceInCells)) {
          newStartDay.setDate(newStartDay.getDate() - 1);
          if (newStartDay.getDay() !== 0 && newStartDay.getDay() !== 6) {
            daysToSubtract++;
          }
        }

        // Verifica que la nueva fecha inicial sea menor que la fecha final
        if (newStartDay.getTime() < endDay.getTime()) {
          activePeriod.outerWidth(newWidth);
          activePeriod.css({width: newWidth,left:endLeft});
          activePeriod.attr("data-start-day", newStartDay.toISOString().substring(0, 10));

          // Actualiza el campo 'start' del objeto 'period' en la base de datos
          $.ajax({
            type: "POST",
            url: `/update_period_start/${activePeriod.data("id")}/`,
            data: {
              'start': newStartDay.toISOString().substring(0, 10)
            },
            success: function(response) {
              if (response.success) {
                console.log('Period start updated successfully.');
              } else {
                console.log('Failed to update period start.');
              }
            }
          });
        }
      });

      $(document).on("mouseup", function () {
        $(document).off("mousemove");
        $(document).off("mouseup");
      });
  });
}

function addDaysToDate(startDate, numDays) {
  let endDate = new Date(startDate);
  let numWeekendDays = 0;
  while (numDays > 0) {
    endDate.setDate(endDate.getDate() + 1);
    if (endDate.getDay() === 6 || endDate.getDay() === 0) {
      numWeekendDays++;
    } else {
      numDays--;
    }
  }
  return endDate.toISOString().substring(0, 10);
}

function findLastDaysOfTheWeek() {
  const lastDayOfWeek = [];
  for (let i = 0; i < years.length; i++) {
    let year = years[i];
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
}

function findLastDaysOfTheMonth() {
  let lastDaysOfMonth = [];
  for (let i = 0; i < years.length; i++) {
    let year = years[i];
    for (let j = 0; j < year.months.length; j++) {
      let month = year.months[j];
      let lastDayOfMonth = month[month.length - 1];
      lastDaysOfMonth.push(lastDayOfMonth.getDate());
    }
  }
  return lastDaysOfMonth;
}

function parseDate(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}


