// api.js
import axios from "axios";

const api = axios.create({
	baseURL: "http://3.104.119.62:3000", // Node.js 서버 주소
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
