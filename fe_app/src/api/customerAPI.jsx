
import axiosClient from "./axiosClient";

class CustomerApi {
  constructor() {
    this.customerBaseUrl = "/customer/";
  }

  createOne = (data) => {
    const url = this.customerBaseUrl;
    return axiosClient.post(url, data);
  };

}

const customerApi = new CustomerApi();
export default customerApi;
