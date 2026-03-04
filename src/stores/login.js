import { defineStore } from "pinia";
import api from "@/api";

export const useLoginStore = defineStore("login", {
  state: () => ({
    userInfo: {
      username: localStorage.getItem("username") || "",
      role: localStorage.getItem("role") || "学生",
    },
  }),
  actions: {
    async login(username, password) {
      try {
        const res = await api.post("/auth/login", { username, password });
        if (res.data.success) {
          this.userInfo.username = res.data.user.username;
          this.userInfo.role = res.data.user.role;
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("role", res.data.user.role);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error("登录失败:", error);
        return false;
      }
    },
    logout() {
      api.post("/auth/logout").catch(() => {});
      this.userInfo = { username: "", role: "学生" };
      localStorage.removeItem("isLogin");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
    },
  },
});
