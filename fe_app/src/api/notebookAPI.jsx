import axiosClient from "./axiosClient";

class NotebookApi {
  constructor() {
    this.notebookBaseUrl = "/notebooks/";
  }
  getAll = (params) => {
    const url = this.notebookBaseUrl;
    return axiosClient.get(url, { params });
  };

  getAllFull = (params) => {
    const url = this.notebookBaseUrl + "nopagination/";
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

  getDetailRowNotebook = (id, params) => {
    const url = "/rownotebook/" + id + "/";
    return axiosClient.get(url, { params });
  };
}

const notebookApi = new NotebookApi();
export default notebookApi;
