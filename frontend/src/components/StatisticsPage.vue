<template>
 <div>
  <svg id="chart"></svg>
 </div>
</template>

<script>
import * as d3 from "d3";
import axios from "axios";

export default {
 mounted() {
  axios
   .get("http://localhost:8000/get-periods-count/")
   .then((response) => {
    const periodsData = response.data.periods_data;
    console.log(periodsData);

    this.drawChart(periodsData);
   })
   .catch((error) => {
    console.error("Error al obtener el número de períodos:", error);
   });
 },
 methods: {
  drawChart(periodsData) {
   const width = 800;
   const height = 600;
   const margin = { top: 20, right: 10, bottom: 30, left: 50 };
   const chartWidth = width - margin.left - margin.right;
   const chartHeight = height - margin.top - margin.bottom;

   const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

   const formattedData = allMonths.map((month) => {
    const periods = periodsData[month] || [];
    const count = periods.reduce((acc, period) => acc + period.count, 0);
    const average = count / periods.length;
    const yValues = periods.reduce(
     (acc, period) => [
      ...acc,
      {
       task_id: period.task_id,
       y0: acc.length === 0 ? 0 : acc[acc.length - 1].y,
       y: acc.length === 0 ? average : acc[acc.length - 1].y + average,
       color: period.color,
      },
     ],
     []
    );
    return { month, periods, count, average, yValues };
   });

   const xScale = d3.scaleBand().domain(allMonths).range([0, chartWidth]).padding(0.2);

   const totalPeriods = formattedData.reduce((acc, { count }) => acc + count, 0);

   const yScale = d3.scaleLinear().domain([0, totalPeriods]).range([chartHeight, 0]);

   const svg = d3.select("#chart").attr("width", width).attr("height", height);

   const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

   chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale));

   chart
    .append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale).ticks(totalPeriods).tickFormat(d3.format("d")));

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
    .attr("y", yScale(0)) // Iniciar la barra en la parte inferior del gráfico
    .attr("width", xScale.bandwidth())
    .attr("height", 0) // Establecer altura inicial en 0
    .attr("fill", (d) => d.color)
    .transition() // Agregar transición
    .duration(500) // Duración de la transición en milisegundos
    .delay((d, i) => i * 50) // Retardo de la transición por cada barra
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
    .attr("fill", "steelblue");
  },
 },
};
</script>

<style>
/* Estilos del componente */
</style>
