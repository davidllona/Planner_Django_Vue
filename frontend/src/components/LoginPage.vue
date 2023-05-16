<template>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
 <div class="login-container">
  <div class="login-box">
   <img src="../assets/logo-practikalia-neg-fit.svg" alt="Imagen practikalia" />
   <h3>LOGIN</h3>
   <form @submit.prevent="login">
    <div class="user-box">
     <i id="user" class="fa fa-user"></i>
     <input type="text" name="username" v-model="username" required="" autocomplete="username" />
     <label>Usuario</label>
    </div>
    <div class="user-box">
     <i id="lock" class="fa fa-lock"></i>
     <input name="password" v-model="password" type="password" required autocomplete="current-password" />
     <label>Contraseña</label>
     <i id="eye" class="fa fa-eye"></i>
    </div>
    <a class="forgot-pw" href="#">Recuperar contraseña</a>
    <div v-if="errorMessage" class="error-message">
     {{ errorMessage }}
    </div>
    <button class="enter">Entrar</button>
   </form>
  </div>
 </div>
</template>

<script>
import auth from "../auth";
import axios from "axios";

export default {
 name: "LoginPage",
 data: () => ({
  username: "",
  password: "",
  errorMessage: "",
 }),
 methods: {
  async login() {
   try {
    // Verificar si la cookie de sesión ya existe
    const sessionid = auth.getUserLogged();
    if (sessionid) {
     // Si la cookie existe, redirigir directamente a la página de inicio
     const lastVisitedPath = localStorage.getItem("lastVisitedPath");
     if (lastVisitedPath) {
      this.$router.push(lastVisitedPath);
     } else {
      this.$router.push("/home");
     }
     return;
    }

    const data = {
     username: this.username,
     password: this.password,
    };

    const response = await axios.post("http://localhost:8000/login/", data);
    if (response.data.success) {
     localStorage.setItem("token", response.data.token);
     auth.setUserLogged(response.data.token);

     this.$router.push("/home");
    } else {
     console.log("Usuario: " + this.username + "" + this.password);
     this.errorMessage = "¡Oops!, inténtalo de nuevo, usuario/contraseña incorrectos";
    }
   } catch (error) {
    console.log(error);
    this.errorMessage = error.message;
   }
  },
 },
};
</script>

<style>
html {
 height: 100%;
}

body {
 margin: 0;
 padding: 0;
 background: linear-gradient(#141e30, #243b55);
 font-family: sans-serif;
}

.login-container {
 position: fixed;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: url("../assets/background-gray.ea099f94f006.jpg");
 background-color: rgba(0, 0, 0, 0.5);
 background-size: cover;
}

.login-box {
 position: absolute;
 top: 50%;
 left: 50%;
 width: 450px;
 padding: 40px;
 transform: translate(-50%, -50%);
 box-sizing: border-box;
 box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
 border-radius: 10px;
 background-color: rgb(26 26 26 / 83%);
}
.login-box #user {
 position: absolute;
 top: 25%;
 left: 0;
 transform: translateY(-50%);
 color: #fff;
 font-size: 20px;
}
.login-box #lock {
 position: absolute;
 top: 25%;
 left: 0;
 transform: translateY(-50%);
 color: #fff;
 font-size: 20px;
}
.login-box h3 {
 margin: 10% 0 30px;
 padding: 0;
 font-size: 20px;
 letter-spacing: 2px;
 color: #fff;
}

.login-box .user-box {
 position: relative;
}

.login-box .user-box input {
 width: 84%;
 padding: 10px 30px;
 font-size: 16px;
 color: #fff;
 margin-bottom: 35px;
 border: none;
 border-bottom: 1px solid #fff;
 outline: none;
 background: transparent;
}

.login-box .user-box label {
 position: absolute;
 top: 0;
 margin-left: 30px;
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
 font-size: 11px;
}
.login-box .user-box input:focus {
 border-bottom-color: #fff;
}

.login-box .enter {
 position: relative;
 display: inline-block;
 padding: 12px;
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
 border: transparent;
 background: #d75083;
 border-radius: 5px;
}

.login-box .forgot-pw {
 color: white;
 font-size: 15px;
}
.login-box .forgot-pw:hover {
 color: rgb(170, 170, 170);
 font-size: 15px;
}

.login-box .enter:hover {
 background: #0069b4;
 color: #fff;
 border-radius: 5px;
 cursor: pointer;
}

.login-box a span {
 position: absolute;
 display: block;
}

.login-box img {
 display: block;
 margin: 0 auto;
 width: 200px;
 margin-bottom: 50px;
}

#eye {
 position: absolute;
 top: 27%;
 right: 0;
 transform: translateY(-50%);
 color: #fff;
 cursor: pointer;
 font-size: 20px;
}

.error-message {
 color: #ff6840;
 font-size: 14px;
 margin-top: 15px;
}
</style>
