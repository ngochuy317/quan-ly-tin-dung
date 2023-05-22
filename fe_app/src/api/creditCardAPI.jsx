
import axiosClient from "./axiosClient";

class CreditCardApi {
  constructor() {
    this.creditCardBaseUrl = "/creditcard/";
  }

  createOne = (data) => {
    const url = this.creditCardBaseUrl + "upload/";
    return axiosClient.post(url, data);
  };

}

const creditCardApi = new CreditCardApi();
export default creditCardApi;
