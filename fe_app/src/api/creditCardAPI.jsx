import axiosClient from "./axiosClient";

class CreditCardApi {
  constructor() {
    this.customer = "customer";
    this.creditCardBaseUrl = "creditcard";
    this.creditCardsBaseUrl = "/creditcards/";
  }

  // createOne = (data) => {
  //   const url = this.creditCardBaseUrl + "upload/";
  //   return axiosClient.post(url, data);
  // };

  search = (params) => {
    const url = "customer/creditcards/";
    return axiosClient.get(url, { params });
  };

  getDetail = (id) => {
    const url = `${this.customer}/${this.creditCardBaseUrl}/${id}/`;
    return axiosClient.get(url);
  };

  updateOne = (id, data) => {
    const url = `${this.customer}/${this.creditCardBaseUrl}/${id}/`;
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
