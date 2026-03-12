import { defineStore } from "pinia";
import api from "@/api";

export const useLoginStore = defineStore("login", {
  state: () => ({
    userInfo: {
      username: localStorage.getItem("username") || "",
      role: localStorage.getItem("role") || "学生",
      class_id: localStorage.getItem("class_id") || null,
      phone: localStorage.getItem("phone") || "",
    },
  }),
  actions: {
    async login(username, password) {
      try {
        console.log("登录请求:", { username, password });
        const res = await api.post("/auth/login", { username, password });
        console.log("登录响应:", res.data);
        if (res.data.success) {
          this.userInfo.username = res.data.user.username;
          this.userInfo.role = res.data.user.role;
          this.userInfo.class_id = res.data.user.class_id;
          this.userInfo.phone = res.data.user.phone || "";
          console.log("用户信息:", this.userInfo);
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("username", username);
          localStorage.setItem("role", res.data.user.role);
          localStorage.setItem("class_id", res.data.user.class_id || "");
          localStorage.setItem("phone", res.data.user.phone || "");
          console.log("localStorage存储:", {
            role: localStorage.getItem("role"),
            username: localStorage.getItem("username"),
            class_id: localStorage.getItem("class_id"),
            phone: localStorage.getItem("phone")
          });
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
      this.userInfo = { username: "", role: "学生", class_id: null, phone: "" };
      localStorage.removeItem("isLogin");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("class_id");
      localStorage.removeItem("phone");
    },
  },
});
