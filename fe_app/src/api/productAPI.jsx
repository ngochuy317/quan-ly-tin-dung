import axiosClient from "./axiosClient";

class ProductApi {
  constructor() {
    this.productBaseUrl = "/products/";
  }
  getAll = (params) => {
    const url = this.productBaseUrl;
    return axiosClient.get(url, { params });
  };

  getDetail = (id) => {
    const url = this.productBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  createOne = (data) => {
    const url = this.productBaseUrl;
    return axiosClient.post(url, data);
  };

  deleteOne = (id) => {
    const url = this.productBaseUrl + id + "/";
    return axiosClient.delete(url);
  };

  updateOne = (id, data) => {
    const url = this.productBaseUrl + id + "/";
    return axiosClient.put(url, data);
  };
}

const productApi = new ProductApi();
export default productApi;
