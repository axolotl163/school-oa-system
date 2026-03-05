import { defineStore } from "pinia";
import api from "@/api";

export const useClassStore = defineStore("class", {
  state: () => ({
    classList: [],
    editForm: { id: "", name: "", grade: "", teacher_id: "" },
    showDialog: false,
  }),
  actions: {
    async fetchClasses() {
      try {
        const res = await api.get("/classes");
        if (res.data.success) this.classList = res.data.data;
      } catch (error) { console.error("获取班级列表失败:", error); }
    },
    async saveClass() {
      try {
        if (this.editForm.id) {
          await api.put(`/classes/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/classes", this.editForm);
        }
        await this.fetchClasses();
        this.editForm = { id: "", name: "", grade: "", teacher_id: "" };
        this.showDialog = false;
      } catch (error) { console.error("保存班级失败:", error); }
    },
    async deleteClass(id) {
      try { await api.delete(`/classes/${id}`); await this.fetchClasses(); }
      catch (error) { console.error("删除班级失败:", error); }
    },
    editClass(row) { this.editForm = { ...row }; this.showDialog = true; },
    addClass() { this.editForm = { id: "", name: "", grade: "", teacher_id: "" }; this.showDialog = true; },
  },
});
