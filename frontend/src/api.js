import axios from "axios";

const api = axios.create({
  baseURL: "https://my-memory-shjw.onrender.com/api",
  //"http://localhost:3333/api", //backend port and routes
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
