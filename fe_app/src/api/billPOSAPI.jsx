import axiosClient from "./axiosClient";

class BillPOSApi {
  constructor() {
    this.billPOSBaseUrl = "/store/";
  }

  getAll = (params) => {
    const url = this.billPOSBaseUrl + "bill-pos/";
    return axiosClient.get(url, { params });
  };

  updateOne = (id, data) => {
    const url = this.billPOSBaseUrl + "bill-pos/" + id + "/";
    return axiosClient.patch(url, data);
  };
}

const billPOSApi = new BillPOSApi();
export default billPOSApi;
