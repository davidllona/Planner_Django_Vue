<template>
    <div>
      <svg id="bar-chart"></svg>
    </div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  import axios from 'axios';
  
  export default {
    mounted() {
      axios.get('http://localhost:8000/get-periods-count/')
        .then(response => {
          const periodCount = response.data.period_count;
          console.log(periodCount);
  
          const periodsData = [
            { periods: periodCount },
          ];
  
          const maxPeriods = Math.max(...periodsData.map((data) => data.periods));
  
          this.drawBarChart(periodsData, maxPeriods);
        })
        .catch(error => {
          console.error('Error al obtener el número de períodos:', error);
        });
    },
    methods: {
      drawBarChart(periodsData, maxPeriods) {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 10, bottom: 30, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
  
        const xScale = d3
          .scaleBand()
          .domain(months)
          .range([0, chartWidth])
          .padding(0.1);
  
        const yScale = d3
          .scaleLinear()
          .domain([0, maxPeriods])
          .range([chartHeight, 0])
          .nice();
  
        const svg = d3
          .select('#bar-chart')
          .attr('width', width)
          .attr('height', height);
  
        const chart = svg
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
  
        chart
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${chartHeight})`)
          .call(d3.axisBottom(xScale));
  
        chart
          .append('g')
          .attr('class', 'y-axis')
          .call(d3.axisLeft(yScale).ticks(maxPeriods));
  
        chart
          .selectAll('.bar')
          .data(periodsData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d, i) => xScale(months[i]))
          .attr('y', (d) => yScale(d.periods))
          .attr('width', xScale.bandwidth())
          .attr('height', (d) => chartHeight - yScale(d.periods));
      },
    },
  };
  </script>
  
  <style>
  /* Estilos del componente */
  </style>
  