import { defineStore } from "pinia";
import api from "@/api";

export const useTaskStore = defineStore("task", {
  state: () => ({
    taskList: [],
    editForm: { id: "", title: "", content: "", status: "待处理", priority: "普通", assignee: "", due_date: "" },
    showDialog: false,
  }),
  actions: {
    async fetchTasks() {
      try {
        const res = await api.get("/tasks");
        if (res.data.success) {
          this.taskList = res.data.data;
        }
      } catch (error) {
        console.error("获取任务列表失败:", error);
      }
    },
    async saveTask() {
      try {
        if (this.editForm.id) {
          await api.put(`/tasks/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/tasks", this.editForm);
        }
        await this.fetchTasks();
        this.editForm = { id: "", title: "", content: "", status: "待处理", priority: "普通", assignee: "", due_date: "" };
        this.showDialog = false;
      } catch (error) {
        console.error("保存任务失败:", error);
      }
    },
    async deleteTask(id) {
      try {
        await api.delete(`/tasks/${id}`);
        await this.fetchTasks();
      } catch (error) {
        console.error("删除任务失败:", error);
      }
    },
    editTask(row) {
      this.editForm = { ...row };
      this.showDialog = true;
    },
    addTask() {
      this.editForm = { id: "", title: "", content: "", status: "待处理", priority: "普通", assignee: "", due_date: "" };
      this.showDialog = true;
    },
  },
});
