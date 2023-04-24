<template>
  <div class="login-box">
    <img src="./assets/logo-practikalia-neg-fit.svg" alt="" width="250px" style="margin-bottom: 10%;">
    <h2>Login</h2>
    <form>
      <div class="user-box">
        <input type="text" name="" required="">
        <label>Usuario</label>
      </div>
      <div class="user-box">
        <input type="password" name="" required="">
        <label>Contraseña</label>
        <div class="pw-view"><i class="fa fa-eye"></i></div>
      </div>
      <!-- <p><a href="#" ><small>Forgot Password ?</small></a></p>	 -->
      <a class="enter" href="#">Entrar</a>
    </form>
  </div>
</template>

<script>
</script>
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

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
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
  left: 0;
  padding: 10px 0;
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

.login-box form a {
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

.login-box a:hover {
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
}
</style>