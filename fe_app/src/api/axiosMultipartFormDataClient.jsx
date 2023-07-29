import axios from "axios";
import queryString from "query-string";

const axiosMultipartFormDataClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosMultipartFormDataClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

axiosMultipartFormDataClient.interceptors.response.use(
  (response) => {
    if (response?.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);

export default axiosMultipartFormDataClient;
