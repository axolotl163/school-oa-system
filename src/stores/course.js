import { defineStore } from "pinia";
import api from "@/api";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courseList: [],
    editForm: { id: "", name: "", code: "", credits: "", hours: "", teacher_id: "" },
    showDialog: false,
  }),
  actions: {
    async fetchCourses() {
      try {
        const res = await api.get("/courses");
        if (res.data.success) {
          this.courseList = res.data.data;
        }
      } catch (error) {
        console.error("获取课程列表失败:", error);
      }
    },
    async saveCourse() {
      try {
        if (this.editForm.id) {
          await api.put(`/courses/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/courses", this.editForm);
        }
        await this.fetchCourses();
        this.editForm = { id: "", name: "", code: "", credits: "", hours: "", teacher_id: "" };
        this.showDialog = false;
      } catch (error) {
        console.error("保存课程失败:", error);
      }
    },
    async deleteCourse(id) {
      try {
        await api.delete(`/courses/${id}`);
        await this.fetchCourses();
      } catch (error) {
        console.error("删除课程失败:", error);
      }
    },
    editCourse(row) {
      this.editForm = { ...row };
      this.showDialog = true;
    },
    addCourse() {
      this.editForm = { id: "", name: "", code: "", credits: "", hours: "", teacher_id: "" };
      this.showDialog = true;
    },
  },
});
