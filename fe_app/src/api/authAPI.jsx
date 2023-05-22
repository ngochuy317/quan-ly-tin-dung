import axiosClient from "./axiosClient";

class AuthApi {
  login = (data) => {
    const url = "user/login/";
    return axiosClient.post(url, data);
  };
}

const authApi = new AuthApi();
export default authApi;
