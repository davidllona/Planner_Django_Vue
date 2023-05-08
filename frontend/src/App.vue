<template>
  
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import auth from "../src/auth";

export default {
  async created() {
    const currentPath = window.location.pathname;
    console.log(currentPath)
    if (auth.getUserLogged()) {
      this.$router.push(currentPath);
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

