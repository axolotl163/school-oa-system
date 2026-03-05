import { defineStore } from "pinia";
import api from "@/api";
import { ElMessage } from "element-plus";

export const useUserManageStore = defineStore("userManage", {
  state: () => ({
    userList: [],
    editForm: { id: "", username: "", password: "", role: "学生", class_id: "" },
    showDialog: false,
  }),
  actions: {
    async fetchUsers() {
      try { const res = await api.get("/users"); if (res.data.success) this.userList = res.data.data; }
      catch (error) { console.error("获取用户列表失败:", error); }
    },
    async saveUser() {
      try {
        const { username, password, role, class_id } = this.editForm;
        
        if (!username) {
          ElMessage.error("用户名不能为空");
          return;
        }
        
        if (!this.editForm.id && !password) {
          ElMessage.error("密码不能为空");
          return;
        }
        
        if (role === "教师" && !class_id) {
          ElMessage.error("请选择教师所属班级");
          return;
        }
        
        const updateData = { username, role, class_id };
        if (password) {
          updateData.password = password;
        }
        
        if (this.editForm.id) {
          await api.put(`/users/${this.editForm.id}`, updateData);
        } else {
          await api.post("/users", { username, password, role, class_id });
        }
        
        await this.fetchUsers();
        this.editForm = { id: "", username: "", password: "", role: "学生", class_id: "" };
        this.showDialog = false;
        ElMessage.success("保存成功");
      } catch (error) { 
        console.error("保存用户失败:", error); 
        ElMessage.error(error.response?.data?.message || "保存失败");
      }
    },
    async deleteUser(id) {
      try { 
        await api.delete(`/users/${id}`); 
        await this.fetchUsers(); 
        ElMessage.success("删除成功");
      }
      catch (error) { 
        console.error("删除用户失败:", error); 
        ElMessage.error(error.response?.data?.message || "删除失败");
      }
    },
    editUser(row) { this.editForm = { ...row, password: "" }; this.showDialog = true; },
    addUser() { this.editForm = { id: "", username: "", password: "", role: "学生", class_id: "" }; this.showDialog = true; },
  },
});
