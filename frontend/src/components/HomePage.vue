<template>
  
  <!-- CSS de Bootstrap -->
<!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> -->
  <section id="home-page" class="page-contain">
    <a href="#" class="data-card">
      <h3>Tareas</h3>
      <p>Aqui podrás consultar tus tareas</p>
      <span class="link-text">
        Mas detalles
      </span>
    </a>
    <a href="#" class="data-card" @click="goToPlanner">
      <h3>Planner</h3>
      <p>Añade, borra y edita tus tareas</p>
      <span class="link-text">
        Mas detalles
      </span>
    </a>

    <a href="#" class="data-card">
      <h3>Estadísticas</h3>
      <p>Las estadisiticas sobre tus tareas</p>
      <span class="link-text">
        Mas detalles
      </span>
    </a>
  </section>
  
</template>

<script>

export default {
  methods: {
    goToPlanner() {
      this.$router.push('/planner');
    },
    checkAuthentication() {
  const token = localStorage.getItem('access_token');
  return token !== null;
}

  }
  
};

</script>

<style scoped>
* {
  box-sizing: border-box;
}
.page-contain {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: #2C2C2C;
  font-family: 'Open Sans', sans-serif;
}
.data-card {
  display: flex;
  flex-direction: column;
  width: 22em; /* Anchura fija */
  min-height: 20.75em;
  overflow: hidden;
  border-radius: 0.5em;
  text-decoration: none;
  background: white;
  margin: 1em;
  padding: 2.75em 2.5em;
  box-shadow: 0 1.5em 2.5em -0.5em rgba(0, 0, 0, .1);
  transition: transform 0.45s ease, background 0.45s ease;
}
.data-card h3 {
  color: #2e3c40;
  font-size: 25px;
  line-height: 1;
  padding-bottom: 0.5em;
  margin: 0 0 0.142857143em;
  border-bottom: 2px solid #753bbd;
  transition: color 0.45s ease, border 0.45s ease;
}
.data-card p {
  opacity: 0;
  color: #fff;
  font-weight: 600;
  line-height: 1.8;
  margin: 0 0 1.25em;
  transform: translateY(-1em);
  transition: opacity 0.45s ease, transform 0.5s ease;
}
.data-card .link-text {
  display: block;
  color: #753bbd;
  font-size: 1.125em;
  font-weight: 600;
  line-height: 1.2;
  margin: auto 0 0;
  transition: color 0.45s ease;
}
.data-card:hover {
  background: #753bbd;
  transform: scale(1.02);
}
.data-card:hover h3 {
  color: #fff;
  border-bottom-color: #a754c4;
}
.data-card:hover h4 {
  color: #fff;
}
.data-card:hover p {
  opacity: 1;
  transform: none;
}
.data-card:hover .link-text {
  color: #fff;
}

/* Media query para dispositivos móviles con tamaño Movil L */
@media screen and (max-width: 640px) {
  .page-contain {
    flex-direction: column;
  }
  .data-card {
    margin: 1em 0;
  }
}

@media screen and (max-width: 320px){
  .data-card{
    padding-left: 2rem;
    height: 40px;
    width: 280px;
  }
  
}

/* Media query para dispositivos tipo tablet */
@media screen and (min-width: 641px) and (max-width: 768px) {
  .data-card {
    margin: 0em 0.5em; /* Margen reducido */
    
  }
}


</style>

  
  
  