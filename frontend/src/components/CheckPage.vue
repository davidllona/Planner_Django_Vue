// CheckPage.vue
<template>
  <div></div>
</template>

<script>
import auth from "@/auth.js";
export default {
  name: "CheckPage",
  mounted() {
    const token = auth.getUserLogged();
    if (token) {
      this.$router.push("/home"); // Redirige a la página de inicio si hay una cookie presente
    } else {
      this.$router.push("/login"); // Redirige a la página de inicio de sesión si no hay una cookie
    }
  },
};
</script>

