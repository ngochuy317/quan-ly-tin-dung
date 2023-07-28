import axiosClient from "./axiosClient";

class PosApi {
  constructor() {
    this.posBaseUrl = "/poses/";
  }
  getAll = (params) => {
    const url = this.posBaseUrl;
    return axiosClient.get(url, { params });
  };

  getAllNickName = () => {
    const url = "/store/nick-name-pos/";
    return axiosClient.get(url);
  };

  getDetail = (id) => {
    const url = this.posBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  createOne = (data) => {
    const url = this.posBaseUrl;
    return axiosClient.post(url, data);
  };

  deleteOne = (id) => {
    const url = this.posBaseUrl + id + "/";
    return axiosClient.delete(url);
  };

  updateOne = (id, data) => {
    const url = this.posBaseUrl + id + "/";
    return axiosClient.put(url, data);
  };
}

const posApi = new PosApi();
export default posApi;
