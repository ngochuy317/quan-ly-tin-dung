import axiosClient from "./axiosClient";

class CardManagementAPI {
  constructor() {
    this.creditCardBaseUrl = "/creditcard/";
  }

  getAll = (params) => {
    const url = this.creditCardBaseUrl + "management/";
    return axiosClient.get(url, { params });
  };

  getAllTransaction4CreditCard = (cardNumber) => {
    const url = this.creditCardBaseUrl + `management/${cardNumber}/`;
    return axiosClient.get(url);
  };
}

const cardManagementAPI = new CardManagementAPI();
export default cardManagementAPI;
