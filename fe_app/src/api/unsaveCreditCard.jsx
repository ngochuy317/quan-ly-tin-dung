import axiosClient from "./axiosClient";

class UnsaveCreditcardApi {
  getAllUnsaveCreditcardByStore = (params) => {
    const url = "unsavecreditcardbystore";
    return axiosClient.get(url, { params });
  };
}

const unsaveCreditcardApi = new UnsaveCreditcardApi();
export default unsaveCreditcardApi;
