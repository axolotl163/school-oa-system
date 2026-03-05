import { defineStore } from "pinia";
import api from "@/api";

export const useExamStore = defineStore("exam", {
  state: () => ({
    examList: [],
    editForm: { id: "", course_id: "", exam_date: "", start_time: "", end_time: "", location: "", status: "待发布" },
    showDialog: false,
  }),
  actions: {
    async fetchExams() { try { const res = await api.get("/exams"); if (res.data.success) this.examList = res.data.data; } catch (e) { console.error(e); } },
    async saveExam() { try { if (this.editForm.id) await api.put(`/exams/${this.editForm.id}`, this.editForm); else await api.post("/exams", this.editForm); await this.fetchExams(); this.editForm = { id: "", course_id: "", exam_date: "", start_time: "", end_time: "", location: "", status: "待发布" }; this.showDialog = false; } catch (e) { console.error(e); } },
    async deleteExam(id) { try { await api.delete(`/exams/${id}`); await this.fetchExams(); } catch (e) { console.error(e); } },
    editExam(row) { this.editForm = { ...row }; this.showDialog = true; },
    addExam() { this.editForm = { id: "", course_id: "", exam_date: "", start_time: "", end_time: "", location: "", status: "待发布" }; this.showDialog = true; },
  },
});
