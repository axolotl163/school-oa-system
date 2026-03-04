import { defineStore } from "pinia";
import api from "@/api";

export const useUserManageStore = defineStore("userManage", {
  state: () => ({
    userList: [],
    editForm: { id: "", username: "", password: "", role: "学生" },
    showDialog: false,
  }),
  actions: {
    async fetchUsers() {
      try {
        const res = await api.get("/users");
        if (res.data.success) {
          this.userList = res.data.data;
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
      }
    },
    async saveUser() {
      try {
        if (this.editForm.id) {
          await api.put(`/users/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/users", this.editForm);
        }
        await this.fetchUsers();
        this.editForm = { id: "", username: "", password: "", role: "学生" };
        this.showDialog = false;
      } catch (error) {
        console.error("保存用户失败:", error);
      }
    },
    async deleteUser(id) {
      try {
        await api.delete(`/users/${id}`);
        await this.fetchUsers();
      } catch (error) {
        console.error("删除用户失败:", error);
      }
    },
    editUser(row) {
      this.editForm = { ...row, password: "" };
      this.showDialog = true;
    },
    addUser() {
      this.editForm = { id: "", username: "", password: "", role: "学生" };
      this.showDialog = true;
    },
  },
});
