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
        console.log("开始保存学生信息");
        console.log("完整编辑表单:", this.editForm);
        const { password, ...studentData } = this.editForm;
        
        console.log("提取的学生数据:", studentData);
        
        if (!studentData.class_id) {
          ElMessage.error("请选择班级");
          console.log("班级ID为空，保存失败");
          return;
        }
        
        console.log("保存学生信息:", studentData);
        console.log("编辑表单ID:", this.editForm.id);
        
        if (this.editForm.id) {
          console.log("更新学生信息，请求路径:", `/students/${this.editForm.id}`);
          console.log("请求数据:", studentData);
          const response = await api.put(`/students/${this.editForm.id}`, studentData);
          console.log("更新响应:", response.data);
        } else {
          console.log("新增学生信息，请求路径:", "/students");
          console.log("请求数据:", studentData);
          const response = await api.post("/students", studentData);
          console.log("新增响应:", response.data);
          
          if (studentData.name && password) {
            await api.post("/users", { username: studentData.name, password, role: "学生", class_id: studentData.class_id });
          }
        }
        
        console.log("保存成功，重新获取学生列表");
        await this.fetchStudents();
        this.editForm = { id: "", name: "", password: "", age: "", class_id: "", phone: "" };
        this.showDialog = false;
        console.log("保存完成，重置表单");
      } catch (error) {
        console.error("保存学生失败:", error);
        if (error.response) {
          console.error("错误响应:", error.response.data);
          console.error("错误状态码:", error.response.status);
          console.error("错误请求路径:", error.config.url);
          console.error("错误请求数据:", error.config.data);
        }
      }
    },
    async deleteStudent(id) {
      try { await api.delete(`/students/${id}`); await this.fetchStudents(); }
      catch (error) { console.error("删除学生失败:", error); }
    },
    editStudent(row) { this.editForm = { ...row, password: "" }; this.showDialog = true; },
    addStudent() { this.editForm = { id: "", name: "", password: "", age: "", class_id: "", phone: "" }; this.showDialog = true; },
  },
});
