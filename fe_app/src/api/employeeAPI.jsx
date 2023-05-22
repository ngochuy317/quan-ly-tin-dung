import axiosClient from "./axiosClient";

class EmployeeApi {
  constructor() {
    this.employeesBaseUrl = "/employees/";
  }
  getAll = (params) => {
    const url = this.employeesBaseUrl;
    return axiosClient.get(url, { params });
  };

  getDetail = (id) => {
    const url = this.employeesBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  createOne = (data) => {
    const url = this.employeesBaseUrl;
    return axiosClient.post(url, data);
  };

  deleteOne = (id) => {
    const url = this.employeesBaseUrl + id + "/";
    return axiosClient.delete(url);
  };

  updateOne = (id, data) => {
    const url = this.employeesBaseUrl + id + "/";
    return axiosClient.put(url, data);
  };
}

const employeeApi = new EmployeeApi();
export default employeeApi;
