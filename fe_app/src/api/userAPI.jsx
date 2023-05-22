import axiosClient from "./axiosClient";

class UserApi {
  constructor() {
    this.posBaseUrl = "/user/";
  }
  getInformationDetail = (params) => {
    const url = this.posBaseUrl + "infomation-detail/";
    return axiosClient.get(url, { params });
  };
}

const userApi = new UserApi();
export default userApi;
