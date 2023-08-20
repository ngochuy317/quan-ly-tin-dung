
import axiosClient from "./axiosClient";

class CustomerApi {
  constructor() {
    this.customerBaseUrl = "/customer/";
  }

  getAll = (params) => {
    const url = this.customerBaseUrl;
    return axiosClient.get(url, { params });
  };

}

const customerApi = new CustomerApi();
export default customerApi;
