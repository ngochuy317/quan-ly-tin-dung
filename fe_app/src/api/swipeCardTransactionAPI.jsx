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
}

const swipeCardTransactionAPI = new SwipeCardTransactionAPI();
export default swipeCardTransactionAPI;
