import axios from "axios";
import queryString from "query-string";
import Swal from "sweetalert2";
// import Swal from 'sweetalert2/src/sweetalert2.js'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "vi-vi",
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
      } else if (error.response.status === 404) {
      } else {
        let textError = "";
        for (const field in error.response.data) {
          textError += `${field} : ${error.response.data[field]}`;
        }
        Swal.fire({
          title: "Error",
          text: textError,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
    throw error;
  }
);

export default axiosClient;
