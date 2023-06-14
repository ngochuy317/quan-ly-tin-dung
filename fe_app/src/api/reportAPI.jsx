import axiosClient from "./axiosClient";

class ReportAPI {
  gettotalmoneytoday = () => {
    return axiosClient.get("/totalmoneytoday/");
  };
}

const reportApi = new ReportAPI();
export default reportApi;
