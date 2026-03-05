import { defineStore } from "pinia";
import api from "@/api";
import { ElMessage } from "element-plus";

export const useTeacherStore = defineStore("teacher", {
  state: () => ({
    teacherList: [],
    editForm: { id: "", name: "", password: "", gender: "", title: "", department: "", phone: "", class_id: "" },
    showDialog: false,
  }),
  actions: {
    async fetchTeachers() {
      try {
        const res = await api.get("/teachers");
        if (res.data.success) {
          this.teacherList = res.data.data;
        }
      } catch (error) {
        console.error("获取教师列表失败:", error);
      }
    },
    async saveTeacher() {
      try {
        const { password, name, class_id, ...teacherData } = this.editForm;
        
        if (!class_id) {
          ElMessage.error("请选择班级");
          return;
        }
        
        if (this.editForm.id) {
          await api.put(`/teachers/${this.editForm.id}`, { ...teacherData, class_id });
        } else {
          await api.post("/teachers", { ...teacherData, class_id });
          
          if (name && password) {
            await api.post("/users", { username: name, password, role: "教师", class_id });
          }
        }
        
        await this.fetchTeachers();
        this.editForm = { id: "", name: "", password: "", gender: "", title: "", department: "", phone: "", class_id: "" };
        this.showDialog = false;
      } catch (error) {
        console.error("保存教师失败:", error);
      }
    },
    async deleteTeacher(id) {
      try {
        await api.delete(`/teachers/${id}`);
        await this.fetchTeachers();
      } catch (error) {
        console.error("删除教师失败:", error);
      }
    },
    editTeacher(row) {
      this.editForm = { ...row, password: "" };
      this.showDialog = true;
    },
    addTeacher() {
      this.editForm = { id: "", name: "", password: "", gender: "", title: "", department: "", phone: "", class_id: "" };
      this.showDialog = true;
    },
  },
});
