import { defineStore } from "pinia";
import api from "@/api";

export const useAttendanceStore = defineStore("attendance", {
  state: () => ({
    attendanceList: [],
    editForm: { id: "", student_id: "", course_id: "", date: "", status: "正常", remark: "" },
    showDialog: false,
  }),
  actions: {
    async fetchAttendance() {
      try {
        const res = await api.get("/attendance");
        if (res.data.success) this.attendanceList = res.data.data;
      } catch (error) { console.error("获取考勤列表失败:", error); }
    },
    async saveAttendance() {
      try {
        if (this.editForm.id) {
          await api.put(`/attendance/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/attendance", this.editForm);
        }
        await this.fetchAttendance();
        this.editForm = { id: "", student_id: "", course_id: "", date: "", status: "正常", remark: "" };
        this.showDialog = false;
      } catch (error) { console.error("保存考勤失败:", error); }
    },
    async deleteAttendance(id) {
      try { await api.delete(`/attendance/${id}`); await this.fetchAttendance(); }
      catch (error) { console.error("删除考勤失败:", error); }
    },
    editAttendance(row) { this.editForm = { ...row }; this.showDialog = true; },
    addAttendance() { this.editForm = { id: "", student_id: "", course_id: "", date: "", status: "正常", remark: "" }; this.showDialog = true; },
  },
});
