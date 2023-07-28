import axiosClient from "./axiosClient";

class FeePOS4CreditCardAPI {
  constructor() {
    this.feePOS4CreditCardAPIAPIBaseUrl = "/store/fee-4-pos-creditcard/";
  }

  getAll = (params) => {
    const url = this.feePOS4CreditCardAPIAPIBaseUrl;
    return axiosClient.get(url, { params });
  };

  getDetail = (id) => {
    const url = this.feePOS4CreditCardAPIAPIBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  createOne = (data) => {
    const url = this.feePOS4CreditCardAPIAPIBaseUrl;
    return axiosClient.post(url, data);
  };

  deleteOne = (id) => {
    const url = this.feePOS4CreditCardAPIAPIBaseUrl + id + "/";
    return axiosClient.delete(url);
  };

  updateOne = (id, data) => {
    const url = this.feePOS4CreditCardAPIAPIBaseUrl + id + "/";
    return axiosClient.put(url, data);
  };
}

const feePOS4CreditCardAPI = new FeePOS4CreditCardAPI();
export default feePOS4CreditCardAPI;
