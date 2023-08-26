import axiosClient from "./axiosClient";

class CustomerApi {
  constructor() {
    this.customerBaseUrl = "/customer/";
  }

  getAll = (params) => {
    const url = this.customerBaseUrl;
    return axiosClient.get(url, { params });
  };

  getDetail = (id) => {
    const url = `${this.customerBaseUrl}${id}/`;
    return axiosClient.get(url);
  };

  updateOne = (id, data) => {
    const url = `${this.customerBaseUrl}${id}/`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  deleteOne = (id) => {
    const url = `${this.customerBaseUrl}${id}/`;
    return axiosClient.delete(url);
  };

  search = (params) => {
    return axiosClient.get(this.customerBaseUrl, { params });
  };
}

const customerApi = new CustomerApi();
export default customerApi;
