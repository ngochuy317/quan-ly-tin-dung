import axiosClient from "./axiosClient";

class StoreCostApi {
  constructor() {
    this.storeBaseUrl = "/storecost/";
  }
  getAll = (params) => {
    const url = this.storeBaseUrl;
    return axiosClient.get(url, { params });
  };

  getAllFull = (params) => {
    const url = this.storeBaseUrl + "nopagination/";
    return axiosClient.get(url, { params });
  };

}

const storeCostApi = new StoreCostApi();
export default storeCostApi;
