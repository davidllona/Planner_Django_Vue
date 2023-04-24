<template>
    <div>
      <!-- tu código aquí -->
    </div>
  </template>
  
  <script>
  export default {
    name: "MyComponent",
    data() {
    return {
      matrix: [],
      years: [],
      yearsRange: [2023, 2024],
      months: [],
      days: [],
    };
  },
    methods: {
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
  