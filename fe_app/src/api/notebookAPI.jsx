import axiosClient from "./axiosClient";

class NotebookApi {
  constructor() {
    this.notebookBaseUrl = "/notebooks/";
  }
  getAll = (params) => {
    const url = this.notebookBaseUrl;
    return axiosClient.get(url, { params });
  };

  getDetail = (id) => {
    const url = this.notebookBaseUrl + id + "/";
    return axiosClient.get(url);
  };

  createOne = (data) => {
    const url = this.notebookBaseUrl;
    return axiosClient.post(url, data);
  };

  deleteOne = (id) => {
    const url = this.notebookBaseUrl + id + "/";
    return axiosClient.delete(url);
  };

  updateOne = (id, data) => {
    const url = this.notebookBaseUrl + id + "/";
    return axiosClient.put(url, data);
  };
}

const notebookApi = new NotebookApi();
export default notebookApi;
