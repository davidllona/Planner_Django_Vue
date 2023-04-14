<template>
  <div class="center-column">
    <h1>Tareas</h1>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        Nombre: {{ task.name }}, Posicion: {{ task.position }}, Id: {{ task.id }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: []
    }
  },
  mounted() {
    axios.get('http://localhost:8080/api/tasks/')
      .then(response => {
        this.tasks = response.data.tasks;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
</script>

<style>
.center-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

li {
  list-style: none;
}
</style>
