import axiosClient from "./axiosClient";

class CreditCardApi {
  constructor() {
    this.creditCardBaseUrl = "/creditcard/";
  }

  // createOne = (data) => {
  //   const url = this.creditCardBaseUrl + "upload/";
  //   return axiosClient.post(url, data);
  // };

  search = (params) => {
    const url = "customer/creditcards/";
    return axiosClient.get(url, { params });
  };

  saveCreditCard2Notebook = (data) => {
    const url = "savecardtonotebook/";
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
}

const creditCardApi = new CreditCardApi();
export default creditCardApi;
