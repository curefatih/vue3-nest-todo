import axios from "axios";
import adapter from "axios/lib/adapters/http";

axios.defaults.adapter = adapter;
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export class API {
  constructor(url) {
    if (!url) {
      url = import.meta.env.VITE_APP_BASE_API_URL || "http://localhost:3000";
      console.log(import.meta.env);
    }
    if (url.endsWith("/")) {
      url = url.substr(0, url.length - 1);
    }
    this.url = url;

    const authToken = localStorage.getItem("token");
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    }
  }

  withPath(path) {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    return `${this.url}${path}`;
  }

  async register({ name, email, password }) {
    return axios
      .post(this.withPath("/users"), {
        name,
        email,
        password,
      })
      .then((r) => r.data);
  }

  async login(email, password) {
    return axios
      .post(this.withPath("/auth/login"), { email, password })
      .then((r) => {
        if (r.data.access_token) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${r.data.access_token}`;
        }
        return r.data;
      });
  }

  async getTodoGroups() {
    return axios.get(this.withPath("/todo")).then((r) => r.data);
  }

  async addTodoGroup(name) {
    return axios.post(this.withPath("/todo"), { name }).then((r) => r.data);
  }

  async getTodoGroupItems(id) {
    return axios.get(this.withPath(`/todo/${id}/item`)).then((r) => r.data);
  }

  async addTodoGroupItem(groupId, item) {
    return axios
      .post(this.withPath(`/todo/${groupId}/item`), item)
      .then((r) => r.data);
  }

  async updateTodoGroupItem(groupId, itemId, item) {
    return axios
      .put(this.withPath(`/todo/${groupId}/item/${itemId}`), item)
      .then((r) => r.data);
  }

  async deleteTodoGroupItem(groupId, itemId) {
    return axios.delete(this.withPath(`/todo/${groupId}/item/${itemId}`));
  }

  async updateTodoGroup(groupId, group) {
    return axios
      .put(this.withPath(`/todo/${groupId}`), group)
      .then((r) => r.data);
  }

  async deleteTodoGroup(groupId) {
    return axios.delete(this.withPath(`/todo/${groupId}`));
  }

  clearToken() {
    axios.defaults.headers.common["Authorization"] = undefined;
  }
}

export default new API(import.meta.env.VITE_APP_BASE_API_URL);
