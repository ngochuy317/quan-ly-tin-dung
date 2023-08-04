import axiosClient from "./axiosClient";

class SwipeCardTransactionAPI {
  constructor() {
    this.creditCardBaseUrl = "/swipecardtransaction/";
  }

  getAll = (params) => {
    const url = this.creditCardBaseUrl;
    return axiosClient.get(url, { params });
  };

  createOne = (data) => {
    const url = this.creditCardBaseUrl;
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  getDetail = (id) => {
    const url = this.creditCardBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  updateOne = (id, data) => {
    const url = this.creditCardBaseUrl + id + "/";
    return axiosClient.patch(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };


  deleteOne = (id) => {
    const url = this.creditCardBaseUrl + id + "/";
    return axiosClient.delete(url);
  };
}

const swipeCardTransactionAPI = new SwipeCardTransactionAPI();
export default swipeCardTransactionAPI;
