import { defineStore } from "pinia";
import api from "@/api";
import { ElMessage } from "element-plus";

export const useStudentStore = defineStore("student", {
  state: () => ({
    studentList: [],
    editForm: { id: "", name: "", password: "", age: "", class_id: "", phone: "" },
    showDialog: false,
  }),
  actions: {
    async fetchStudents() {
      try {
        const res = await api.get("/students");
        if (res.data.success) this.studentList = res.data.data;
      } catch (error) { console.error("获取学生列表失败:", error); }
    },
    async saveStudent() {
      try {
        const { password, name, ...studentData } = this.editForm;
        
        if (!studentData.class_id) {
          ElMessage.error("请选择班级");
          return;
        }
        
        if (this.editForm.id) {
          await api.put(`/students/${this.editForm.id}`, studentData);
        } else {
          await api.post("/students", studentData);
          
          if (name && password) {
            await api.post("/users", { username: name, password, role: "学生", class_id: studentData.class_id });
          }
        }
        
        await this.fetchStudents();
        this.editForm = { id: "", name: "", password: "", age: "", class_id: "", phone: "" };
        this.showDialog = false;
      } catch (error) { console.error("保存学生失败:", error); }
    },
    async deleteStudent(id) {
      try { await api.delete(`/students/${id}`); await this.fetchStudents(); }
      catch (error) { console.error("删除学生失败:", error); }
    },
    editStudent(row) { this.editForm = { ...row, password: "" }; this.showDialog = true; },
    addStudent() { this.editForm = { id: "", name: "", password: "", age: "", class_id: "", phone: "" }; this.showDialog = true; },
  },
});
