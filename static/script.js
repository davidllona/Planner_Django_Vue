let matrix = [];
const years = [];
let yearsRange = [2023, 2024];

$(document).ready(function () {
  createMatrixDates(yearsRange);
  createHeaderMonths();
  createHeader();
  createTasks();
  createPeriodTasks();
  createNewTask();
  addPeriodToTask();
  readDatabase();
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

function createTasks() {
  $.ajax({
    url: '/read_database',
    success: function (response) {
     
      for (let i = 0; i < response.tasks.length; i++) {
        let task = response.tasks[i];
        console.log(task)
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
<<<<<<< HEAD
        div_task.attr("data-id", task.id);
=======
        div_task.attr("id", task.id);
>>>>>>> 5d42a6d899f9dac447b1222b6fc1f4f1b9a56dfb
        for (let j = 0; j < matrix[i].length; j++) {
          let day = matrix[i][j];
          let $cell = $("<div class='cell' data-date='" + parseDate(day) + "'>&nbsp;</div>");
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
  });
}

function addPeriodToTask() {
  $(document).on("click", ".cell", function (event) {
    if ($(this).find(".period").length === 0) {
      let dayIndex = $(this).attr("data-date");
<<<<<<< HEAD
      console.log(dayIndex)
      let currentTask = $(this).parent().attr("data-id");
      console.log(currentTask)
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
          console.log(response.message);
          let period = $("<div class='period resizable'><span class='left-span'></span><span  draggable='true' class='center-span drag-handle'></span><span class='right-span'></span></div>");
          period.attr("data-id", currentTask);
          period.attr("data-day-start", dayIndex);
          $(event.target).append(period);
          strechLeft();
          strechRight();
          menu();
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
        },
      });
=======
      let period = $("<div class='period resizable'><span class='left-span'></span><span  draggable='true' class='center-span drag-handle'></span><span class='right-span'></span></div>");
      let currentTask = $(this).parent().attr("data-index");
      let periodTaskName = $(".tasks-rows[data-index='" + currentTask + "']").text();
      console.log(periodTaskName)
      period.attr("data-index", currentTask);
      period.attr("data-day-start", dayIndex);
      console.log(typeof(dayIndex))
      $(this).append(period);
      strechLeft();
      strechRight();
      menu();
>>>>>>> 5d42a6d899f9dac447b1222b6fc1f4f1b9a56dfb
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
        console.log(color);
        $.ajax({
          url: `/update-period-color/${period.data("data-id")}/`,
          method: 'POST',
          data: {'color': color},
          success: function () {
            period.css("background-color", color);
            $("#context-menu").hide();
          },
          error: function () {
            alert('Error al actualizar el color del período');
            console.log(period.data("data-id"))
          }
        });
      });
    menu.css({ left: e.pageX, top: e.pageY });
    menu.show();
  });
  $(document).on("click", "#delete-task", function () {
    let period = $("#context-menu").data("period");
    console.log(period)
    period.remove();
    $("#context-menu").hide();
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



function createPeriodTasks() {
  $.ajax({
    url: '/read_database',
    success: function (response) {
      for (let i = 0; i < response.tasks.length; i++) {
        let task = response.tasks[i];
        let div_period_tasks = $("<div class='tasks-periods task-overflow' contenteditable='true'></div>");
        div_period_tasks.attr("data-position", task.position);
<<<<<<< HEAD
        div_period_tasks.attr("data-id", task.id);
=======
        div_period_tasks.attr("id", task.id);
>>>>>>> 5d42a6d899f9dac447b1222b6fc1f4f1b9a56dfb

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
      task_periods.each(function (i) {
        let period_id = $(this).attr("data-index");
        new_matrix.push(matrix[period_id]);
        let period = $(".period[data-index='" + period_id + "']");
        period.insertAfter($(".task:eq(" + i + ")"));
        $(this).insertAfter($(".tasks-periods:eq(" + i + ")"));
      });
      matrix = new_matrix;
      let periods = $(".period");
      task_periods.each(function (i) {
        $(this).attr("data-index", i);
        periods.eq(i).attr("data-index", i);
        let currentperiod = i;
        let periods = periods.eq(i).find(".period");
        periods.each(function () {
          $(this).attr("data-index", currentperiod);
        });
      });
    },
  });
}

function createNewTask() {
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

function dragAndDrop() {
  let currentDraggingElement = null;
$(document).on("dragstart", ".period .center-span", function (event) {
  currentDraggingElement = $(this).closest(".period");
  let position = currentDraggingElement.attr("data-position");
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
  let currentperiod = $(this).parent().attr("data-index");
  let sourceperiod = currentDraggingElement.attr("data-index");
  currentDraggingElement.attr("data-index", currentperiod);
  currentDraggingElement.detach().appendTo($(this));
  
  // Move task-period to match task period if different
  if (currentperiod !== sourceperiod) {
    let taskperiod = $(".tasks-periods[data-index='" + sourceperiod + "']");
    taskperiod.detach();
    if (currentperiod < sourceperiod) {
      taskperiod.insertBefore($(".tasks-periods[data-index='" + currentperiod + "']"));
    } else {
      taskperiod.insertAfter($(".tasks-periods[data-index='" + currentperiod + "']"));
    }
    taskperiod.attr("data-index", currentperiod);
    
    // Update data-index for task periods and red divs
    let taskperiods = $(".tasks-periods");
    taskperiods.each(function (i) {
      $(this).attr("data-index", i);
      let periods = $(this).find(".period");
      periods.each(function () {
        $(this).attr("data-index", i);
      });
    });
  }
  
  // Update data-day-start
  let redDiv = currentDraggingElement;
  let cell = redDiv.closest(".cell");
  let dayStart = cell.attr("data-index");
  redDiv.attr("data-day-start", dayStart);
});

  

  $(document).on("dragend", ".task", function (event) {
    currentDraggingElement = null;
    let redDiv = $(this).closest(".task");
    let newPosition = redDiv.parent().attr("data-index") + "-" + redDiv.index();
    redDiv.attr(newPosition);
  });
  
}

function strechRight() {
  $(".period.resizable .right-span").on("mousedown", function (event) {
    if ($(event.target).hasClass("right-span")) {
      let activeRedDiv = $(this).parent(".period");

      activeRedDiv.addClass("active-right");
      let startPosition = event.pageX;
      let startWidth = activeRedDiv.outerWidth();
      let newWidth = 0;
      let nextRedDivPosition = activeRedDiv.offset().left + activeRedDiv.outerWidth();
      console.log(activeRedDiv.offset().left);
      $(document).on("mousemove", function (event) {
        let distance = event.pageX - startPosition;
        let distanceInCells = Math.round(
          distance / $(document).find(".cell").outerWidth()
        );
        if (newWidth < 19) {
          newWidth = 19;
        }
        newWidth = startWidth + distanceInCells * 20;

        let isBlocked = false;
        $(".period").each(function () {
          if (
            $(this).offset().top === activeRedDiv.offset().top &&
            $(this).offset().left > nextRedDivPosition &&
            $(this).offset().left < activeRedDiv.offset().left + newWidth
          ) {
            isBlocked = true;
            newWidth = $(this).offset().left - activeRedDiv.offset().left;
            return false;
          }
        });

        if (!isBlocked) {
          activeRedDiv.outerWidth(newWidth);
          let startDay = activeRedDiv.attr("data-day-start");
          console.log(startDay)
          let currentDay = new Date(startDay);
          let daysToIncrement = Math.floor(newWidth / 20);
          for (let i = 0; i < daysToIncrement; i++) {
            currentDay.setDate(currentDay.getDate() + 1);
            if (currentDay.getDay() === 6) {
              currentDay.setDate(currentDay.getDate() + 2);
            } else if (currentDay.getDay() === 0) {
              currentDay.setDate(currentDay.getDate() + 1);
            }
          }
          activeRedDiv.attr("data-day-end", currentDay.toDateString());
        }
        
      });

      $(document).on("mouseup", function () {
        $(document).off("mousemove");
        $(document).off("mouseup");
      });
    }
  });
}


function strechLeft() {
  $(".period.resizable .left-span").on("mousedown", function (event) {
    if ($(event.target).hasClass("left-span")) {
      let activePeriod = $(this).parent(".period");
      activePeriod.addClass("active-left");
      let startPosition = event.pageX;
      let startWidth = activePeriod.outerWidth();
      let startLeft = parseInt(activePeriod.css("left"));
      let endLeft;
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

        let isBlocked = false;
        $(".period").each(function () {
          if (
            $(this).offset().top === activePeriod.offset().top &&
            $(this).offset().left + $(this).outerWidth() >
              activePeriod.offset().left - distance &&
            $(this).offset().left < activePeriod.offset().left
          ) {
            isBlocked = true;
            newWidth =activePeriod.outerWidth() +activePeriod.offset().left -$(this).offset().left;
            endLeft = $(this).offset().left;
            return false;
          }
        });

        if (!isBlocked) {
          activePeriod.outerWidth(newWidth);
          activePeriod.css({width: newWidth,left: endLeft,
          });
        }
      });
      $(document).on("mouseup", function () {
        $(document).off("mousemove");
        $(document).off("mouseup");
        activePeriod.removeClass("active-left");
      });
    }
  });
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

function readDatabase() {
<<<<<<< HEAD
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
          console.log(period.task_id)

         // Crear el elemento period y agregar atributos
         let $period_div = $("<div class='period resizable'><span class='left-span'></span><span  draggable='true' class='center-span drag-handle'></span><span class='right-span'></span></div>");
         $period_div.css("background-color", period.color);
         $period_div.attr("data-index", index);
         $period_div.attr("data-start-day", period.start);
         $period_div.attr("data-end-day", period.end);
         $cell.append($period_div);

         // Calcular el ancho del period
         let cellWidth = $(document).find(".cell").outerWidth();
         let startCellIndex = $cell.index();
         let endCellIndex = $task.find(".cell[data-date='" + period.end + "']").index();
         let numCells = endCellIndex - startCellIndex + 1;
         let width = numCells * cellWidth - 1;
         $period_div.css("width", width + "px");

          
          strechLeft();
          strechRight();
          menu();
        });
      }
    });
  });

=======
  // $(document).ready(function() {
  //   $.ajax({
  //     url: "/get-tasks/",
  //     type: "GET",
  //     dataType: "json",
  //     success: function(data) {
  //       // Agregar las tareas a las filas correspondientes
  //       $.each(data.tasks, function(index, task) {
  //         // Buscar la fila correspondiente
  //         let $period = $(".period[data-index='" + index + "']");

  //         // Calcular la posición de inicio y fin de la tarea
  //         let startCellIndex = getCellIndex(task.start);
  //         let endCellIndex = getCellIndex(task.end);
  //         let $startCell = $period.find(".cell").eq(startCellIndex);

  //         // Crear el elemento task y agregar atributos
  //         let $task_div = $("<div class='task resizable'><span class='left-span'></span><span  draggable='true' class='center-span drag-handle'></span><span class='right-span'></span></div>");
  //         $task_div.css("background-color", task.color);
  //         $task_div.attr("data-index", index); // Agregar atributo data-index igual al índice de la fila
  //         $task_div.attr("data-start-day",task.start); // Agregar atributo data-start-day con la fecha de inicio convertida
  //         $task_div.attr("data-end-day",task.end);
  //         $startCell.append($task_div);

  //         // Calcular el ancho del task
  //         let cellWidth = $(document).find(".cell").outerWidth();
  //         let numCells = endCellIndex - startCellIndex + 1;
  //         let width = numCells * cellWidth - 1;
  //         $task_div.css("width", width + "px");

  //         // Agregar la tarea a la lista de tareas
  //         let $task_name = $("<div class='task_name'>" + task.name + "</div>");
  //         $task_name.attr("title", task.start + " - " + task.end);
  //         $(".tasks-periods[data-index ='" + index + "']").append($task_name);
  //         console.log(task.name);
  //         strechLeft();
  //         strechRight();
  //         menu();
  //       });
  //     }
  //   });
  //   // Función auxiliar para calcular la posición de una celda en la matriz
  //   function getCellIndex(dateString) {
  //     let date = new Date(dateString);
  //     for (let i = 0; i < matrix[0].length; i++) {
  //       if (matrix[0][i].getFullYear() === date.getFullYear() && matrix[0][i].getMonth() === date.getMonth() && matrix[0][i].getDate() === date.getDate()) {
  //         return i;
  //       }
  //     }
  //     return -1;
  //   }
  // });
>>>>>>> 5d42a6d899f9dac447b1222b6fc1f4f1b9a56dfb
}