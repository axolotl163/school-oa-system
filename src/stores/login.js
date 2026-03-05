import { defineStore } from "pinia";
import api from "@/api";

export const useLoginStore = defineStore("login", {
  state: () => ({
    userInfo: {
      username: localStorage.getItem("username") || "",
      role: localStorage.getItem("role") || "学生",
      class_id: localStorage.getItem("class_id") || null,
    },
  }),
  actions: {
    async login(username, password) {
      try {
        const res = await api.post("/auth/login", { username, password });
        if (res.data.success) {
          this.userInfo.username = res.data.user.username;
          this.userInfo.role = res.data.user.role;
          this.userInfo.class_id = res.data.user.class_id;
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("role", res.data.user.role);
          localStorage.setItem("class_id", res.data.user.class_id || "");
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
      this.userInfo = { username: "", role: "学生", class_id: null };
      localStorage.removeItem("isLogin");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("class_id");
    },
  },
});
