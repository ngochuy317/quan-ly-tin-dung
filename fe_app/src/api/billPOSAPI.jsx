
import axiosClient from "./axiosClient";

class BillPOSApi {
  constructor() {
    this.billPOSBaseUrl = "/store/";
  }

  getAll = (params) => {
    const url = this.billPOSBaseUrl + "bill-pos/";
    return axiosClient.get(url, { params });
  };

}

const billPOSApi = new BillPOSApi();
export default billPOSApi;
