// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.45.211:4000", // Node.js 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
