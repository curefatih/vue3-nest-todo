import router from "@/router";
import axios from "axios";
import { defineStore } from "pinia";
import API from "@/api";
import { useTodoGroupStore } from "./todoGroups";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    error: "",
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
  },
  actions: {
    async login(email, password) {
      this.error = "";
      return API.login(email, password)
        .then((data) => {
          if (data.access_token || data.user) {
            this.user = data.user;
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.access_token);
            router.push("/");
          }
          return data;
        })
        .catch((err) => {
          console.log(err);
          this.error = err.response.data.message;
        });
    },
    registerUser(username, email, password) {
      return axios.post("/api/users", {
        username,
        email,
        password,
      });
    },
    logout() {
      const todoGroupStore = useTodoGroupStore();
      todoGroupStore.resetState();
      this.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    },
  },
});
