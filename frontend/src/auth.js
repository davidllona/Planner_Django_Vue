import axios from "axios";
import Cookies from "js-cookie";

const ENDPOINT_PATH = "http://localhost:8000/";

export default {
  setUserLogged(token) {
    Cookies.set("sessionid", token);
  },
  getUserLogged() {
    return Cookies.get("sessionid");
  },
  login(username, password) {
    const user = { username, password };
    return axios.post(ENDPOINT_PATH + "login/", user).then((response) => {
      const token = response.data.token;
      this.setUserLogged(token);
      return response;
    });
  },
  
};
