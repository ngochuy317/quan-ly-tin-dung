import axiosClient from "./axiosClient";

class StoreMakePOSApi {
  constructor() {
    this.storeMakePOSBaseUrl = "/store/stores-make-pos/";
  }

  getAll = (params) => {
    const url = this.storeMakePOSBaseUrl;
    return axiosClient.get(url, { params });
  };

  getAllFull = () => {
    const url = this.storeMakePOSBaseUrl + "nopagination/";
    return axiosClient.get(url);
  };

  getDetail = (id) => {
    const url = this.storeMakePOSBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  createOne = (data) => {
    const url = this.storeMakePOSBaseUrl;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  deleteOne = (id) => {
    const url = this.storeMakePOSBaseUrl + id + "/";
    return axiosClient.delete(url);
  };

  updateOne = (id, data) => {
    const url = this.storeMakePOSBaseUrl + id + "/";
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
}

const storeMakePOSApi = new StoreMakePOSApi();
export default storeMakePOSApi;
