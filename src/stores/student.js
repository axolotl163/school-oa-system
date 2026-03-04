import { defineStore } from "pinia";
import api from "@/api";

export const useStudentStore = defineStore("student", {
  state: () => ({
    studentList: [],
    editForm: { id: "", name: "", age: "", class: "", phone: "" },
    showDialog: false,
  }),
  actions: {
    async fetchStudents() {
      try {
        const res = await api.get("/students");
        if (res.data.success) {
          this.studentList = res.data.data;
        }
      } catch (error) {
        console.error("获取学生列表失败:", error);
      }
    },
    async saveStudent() {
      try {
        if (this.editForm.id) {
          await api.put(`/students/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/students", this.editForm);
        }
        await this.fetchStudents();
        this.editForm = { id: "", name: "", age: "", class: "", phone: "" };
        this.showDialog = false;
      } catch (error) {
        console.error("保存学生失败:", error);
      }
    },
    async deleteStudent(id) {
      try {
        await api.delete(`/students/${id}`);
        await this.fetchStudents();
      } catch (error) {
        console.error("删除学生失败:", error);
      }
    },
    editStudent(row) {
      this.editForm = { ...row };
      this.showDialog = true;
    },
    addStudent() {
      this.editForm = { id: "", name: "", age: "", class: "", phone: "" };
      this.showDialog = true;
    },
  },
});
