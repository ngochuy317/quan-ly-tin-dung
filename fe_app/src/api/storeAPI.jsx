import axiosClient from "./axiosClient";

class StoreApi {
  constructor() {
    this.storeBaseUrl = "/stores/";
  }
  getAll = (params) => {
    const url = this.storeBaseUrl;
    return axiosClient.get(url, { params });
  };

  getAllFull = (params) => {
    const url = this.storeBaseUrl + "nopagination/";
    return axiosClient.get(url, { params });
  };

  getDetail = (id) => {
    const url = this.storeBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  createOne = (data) => {
    const url = this.storeBaseUrl;
    return axiosClient.post(url, data);
  };

  deleteOne = (id) => {
    const url = this.storeBaseUrl + id + "/";
    return axiosClient.delete(url);
  };

  updateOne = (id, data) => {
    const url = this.storeBaseUrl + id + "/";
    return axiosClient.put(url, data);
  };
}

const storeApi = new StoreApi();
export default storeApi;
