<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div class="login-box">
    <img
      src="../src/assets/logo-practikalia-neg-fit.svg"
      alt="Imagen practikalia"
    />
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="user-box">
        <i id="user" class="fa fa-user"></i>
        <input
          type="text"
          name="username"
          v-model="username"
          required=""
          autocomplete="username"
        />
        <label>Usuario</label>
      </div>
      <div class="user-box">
        <i id="lock" class="fa fa-lock"></i>
        <input
          name="password"
          v-model="password"
          v-bind:type="showPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
        />
        <label>Contraseña</label>
        <i id="eye" class="fa fa-eye"></i>
      </div>
      <a class="forgot-pw" href="#">Recuperar contraseña</a>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <a class="enter" href="#" @click="login">Entrar</a>
    </form>
  </div>
</template>

<script>
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      showPassword: false, // Agregando la propiedad showPassword
    };
  },
  methods: {
    login() {
      const data = {
        username: this.username,
        password: this.password,
      };
      axios
        .post("http://localhost:8000/login/", data)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            console.log("Usuarioooooo: " + this.username + "" + this.password);
            this.$router.push({ name: "HomePage" });

          } else {
            console.log("Usuario: " + this.username + "" + this.password);
            this.errorMessage =
              "¡Oops!, inténtalo de nuevo, usuario/contraseña incorrectos";
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },
  },
};
</script>

<style>
/* styles here */
</style>

<style>
html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}
.login-box #user {
  position: absolute;
  top: 25%;
  left: 0;
  transform: translateY(-50%);
  color: #fff;
}
.login-box #lock {
  position: absolute;
  top: 25%;
  left: 0;
  transform: translateY(-50%);
  color: #fff;
}
.login-box h2 {
  margin: 10% 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 88%;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  margin-left: 20px;
  left: 0;
  padding: 10px 0px;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #fff;
  font-size: 12px;
}

.login-box .enter {
  position: relative;
  display: inline-block;
  padding: 5px;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
  width: 100%;
  text-align: center;
}

.login-box .forgot-pw {
  color: white;
  font-size: 15px;
}

.login-box .enter:hover {
  background: #d75083;
  color: #fff;
  border-radius: 5px;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box img {
  display: block;
  margin: 0 auto;
  width: 200px;
}

#eye {
  position: absolute;
  top: 30%;
  right: 0;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 15px;
}
</style>
