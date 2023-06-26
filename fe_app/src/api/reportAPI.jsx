import axiosClient from "./axiosClient";

class ReportAPI {
  getTotalMoneyToday = () => {
    return axiosClient.get("/totalmoneytoday/");
  };

  getAllSwipeTransactionReport = (params) => {
    return axiosClient.get("/swipecardtransactionreport/", { params });
  };
}

const reportApi = new ReportAPI();
export default reportApi;
