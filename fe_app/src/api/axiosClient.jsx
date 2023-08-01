import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://165.22.102.193:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    // Handle errors
    if (error?.response) {
      if (
        error.response.status === 403 &&
        error.response.data?.detail === "Token expired"
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("activeTab");
        window.location.href = "/login";
      }
    }
    throw error;
  }
);

export default axiosClient;
