import { defineStore } from "pinia";
import api from "@/api";

export const useTeacherStore = defineStore("teacher", {
  state: () => ({
    teacherList: [],
    editForm: { id: "", name: "", gender: "", title: "", department: "", phone: "" },
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
        if (this.editForm.id) {
          await api.put(`/teachers/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/teachers", this.editForm);
        }
        await this.fetchTeachers();
        this.editForm = { id: "", name: "", gender: "", title: "", department: "", phone: "" };
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
      this.editForm = { ...row };
      this.showDialog = true;
    },
    addTeacher() {
      this.editForm = { id: "", name: "", gender: "", title: "", department: "", phone: "" };
      this.showDialog = true;
    },
  },
});
