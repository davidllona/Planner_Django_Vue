<template>
  <div class="chart-container">
    <svg id="chart"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import axios from "axios";

export default {
  data() {
    return {
      tooltip: null,
    };
  },
  mounted() {
    axios
      .get("http://localhost:8000/get-periods-count/")
      .then((response) => {
        const periodsData = response.data.periods_data;
        console.log(periodsData);

        this.getAveragePeriods(periodsData);
      })
      .catch((error) => {
        console.error("Error al obtener el número de períodos:", error);
      });
  },
 methods: {
  getAveragePeriods(periodsData) {
   axios
    .get("http://localhost:8000/get-average-periods/")
    .then((response) => {
     const averagePeriod = response.data.average_period;
     console.log(averagePeriod);

     this.getAveragePoints(periodsData, averagePeriod);
     console.log(periodsData);
    })
    .catch((error) => {
     console.error("Error al obtener el promedio de períodos:", error);
    });
  },

  getAveragePoints(periodsData, averagePeriod) {
   axios
    .get("http://localhost:8000/get-average/")
    .then((response) => {
     const averageData = response.data.average_data;
     console.log(averageData);

     const allMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

     const formattedData = allMonths.map((month) => {
      const periods = periodsData[month] || [];
      const count = periods.reduce((acc, period) => acc + period.count, 0);

      const average = count / periods.length;
      const yValues = periods.reduce(
       (acc, period) => [
        ...acc,
        {
         task_id: period.task_id,
         task_name: period.task_name,
         y0: acc.length === 0 ? 0 : acc[acc.length - 1].y,
         y: acc.length === 0 ? average : acc[acc.length - 1].y + average,
         color: period.color,
        },
       ],
       []
      );
      return { month, periods, count, average, yValues };
     });

     this.drawChart(formattedData, averagePeriod);
    })
    .catch((error) => {
     console.error("Error al obtener los datos promedio:", error);
    });
  },

  drawChart(formattedData, averagePeriod) {
   const width = 600;
   const height = 400;
   const margin = { top: 20, right: 10, bottom: 30, left: 10 };
   const chartWidth = width - margin.left - margin.right;
   const chartHeight = height - margin.top - margin.bottom;

   const allMonths = formattedData.map((data) => data.month);

   const xScale = d3.scaleBand().domain(allMonths).range([0, chartWidth]).padding(0.2);

   const maxPeriodsInMonth = Math.max(...formattedData.map((data) => data.count));

   const yScale = d3.scaleLinear().domain([0, maxPeriodsInMonth]).range([chartHeight, 0]);

   const svg = d3.select("#chart").attr("width", width).attr("height", height);

   const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
   const tooltipWidth = 100; // Ancho del tooltip
   const tooltipHeight = 30; // Alto del tooltip

   const svgContainer = d3.select(this.$el);

   const tooltip = svgContainer
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "#fff")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("padding", "8px")
    .style("pointer-events", "none")
    .style("display", "none");

   chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale));

   // Agregar líneas horizontales del eje y
   chart
    .append("g")
    .attr("class", "grid-lines")
    .call(
     d3
      .axisLeft(yScale)
      .ticks(maxPeriodsInMonth)
      .tickSize(-chartWidth)
      .tickFormat((d) => (d !== 0 ? d3.format("d")(d) : ""))
    );

   // Agregar leyenda en el eje x
   chart
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", chartWidth - margin.right * 5)
    .attr("font-size", "12px")
    .attr("y", chartHeight + margin.bottom)
    .style("text-anchor", "right")
    .text("Meses");

   // Agregar leyenda en el eje y
   chart
    .append("text")
    .attr("class", "y-axis-label")
    .attr("font-size", "12px")
    .attr("x", margin.left * 11)
    .attr("margin-bottom", "40px")
    .style("text-anchor", "middle")
    .text("Máximo número de periodos en un mes");

   // Agrega la zona semitransparente para el número medio de periodos
   chart
    .append("rect")
    .attr("class", "average-zone")
    .attr("x", 0)
    .attr("y", yScale(averagePeriod))
    .attr("width", chartWidth)
    .attr("height", chartHeight - yScale(averagePeriod))
    .attr("fill", "steelblue")
    .attr("opacity", 0.1)
    .on("mouseover", (event) => {
     const averageText = `De media hay ${averagePeriod.toFixed(2)} periodos por tareas`; // Redondear a 2 decimales

     tooltip
      .style("display", "block")
      .html(averageText)
      .style("top", `${event.clientY - tooltipHeight}px`)
      .style("left", `${event.clientX - tooltipWidth / 2}px`)
      .style("transform", `translateX(20%) translateY(-20%)`);
    })
    .on("mousemove", (event) => {
     // Actualizar la posición del tooltip relativa al ratón
     tooltip.style("top", `${event.clientY - tooltipHeight}px`).style("left", `${event.clientX - tooltipWidth / 2}px`);
    })
    .on("mouseout", () => {
     this.tooltip = null;
     tooltip.style("display", "none");
    });

   const barGroups = chart
    .selectAll(".bar-group")
    .data(formattedData)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .attr("transform", (d) => `translate(${xScale(d.month)}, 0)`);

   barGroups
    .selectAll(".bar")
    .data((d) => d.yValues)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", yScale(0))
    .attr("width", xScale.bandwidth())
    .attr("height", 0)
    .attr("fill", (d) => d.color)
    .on("mouseover", (event, d) => {
     const currentMonth = d3.select(event.currentTarget.parentNode).datum().month;
     const taskId = d.task_id;
     const taskName = d.task_name;
     const color = d.color;

     const totalPeriods = formattedData.find((data) => data.month === currentMonth).count;

     this.tooltip = {
      month: currentMonth,
      task: taskName,
      task_id: taskId,
      count: totalPeriods,
      color: color,
     };

     // Mostrar el tooltip y actualizar su posición relativa al ratón
     tooltip
      .style("display", "block")
      .html(`<span style="color:${color}">${taskName}</span>: ID: ${taskId}`)
      .style("top", `${event.clientY - tooltipHeight}px`)
      .style("left", `${event.clientX - tooltipWidth / 2}px`);
    })

    .on("mousemove", (event) => {
     // Actualizar la posición del tooltip relativa al ratón
     tooltip.style("top", `${event.clientY - tooltipHeight}px`).style("left", `${event.clientX - tooltipWidth / 2}px`);
    })
    .on("mouseout", () => {
     this.tooltip = null;
     tooltip.style("display", "none");
    })
    .transition()
    .duration(500)
    .delay((d, i) => i * 50)
    .attr("y", (d) => yScale(d.y))
    .attr("height", (d) => yScale(d.y0) - yScale(d.y));

   const line = d3
    .line()
    .x((d, i) => xScale(allMonths[i]) + xScale.bandwidth() / 2)
    .y((d) => yScale(d.average))
    .curve(d3.curveMonotoneX);

   chart
    .append("path")
    .datum(formattedData)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

   chart
    .selectAll(".average-point")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("class", "average-point")
    .attr("cx", (d, i) => xScale(allMonths[i]) + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale(d.average))
    .attr("r", 4)
    .attr("fill", "steelblue")
    .on("mouseover", function (event, d) {
     d3.select(this).transition().duration(200).attr("r", 8);

     tooltip
      .style("display", "block")
      .html(`Número medio de periodos en ${d.month}: ${d.average}`)
      .style("top", `${event.clientY - tooltipHeight}px`)
      .style("left", `${event.clientX - tooltipWidth / 2}px`);
    })
    .on("mousemove", (event) => {
     tooltip.style("top", `${event.clientY - tooltipHeight}px`).style("left", `${event.clientX - tooltipWidth / 2}px`);
    })
    .on("mouseout", function () {
     d3.select(this).transition().duration(200).attr("r", 4);

     this.tooltip = null;
     tooltip.style("display", "none");
    });
  },
 },
};
</script>

<style>
.grid-lines line {
 stroke: lightgray;
}

.grid-lines path.domain + .tick line {
 stroke: black;
}
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
}

.chart-container svg {
  background-color: #fff;
  border-radius: 8px;
  margin-left: 20px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

</style>
