// api.js
import axios from "axios";

const api = axios.create({
	baseURL: "https://plasticly-nonprohibitive-marge.ngrok-free.dev",
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;
