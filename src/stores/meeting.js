import { defineStore } from "pinia";
import api from "@/api";

export const useMeetingStore = defineStore("meeting", {
  state: () => ({
    meetingList: [],
    editForm: { id: "", title: "", content: "", organizer: "", meeting_date: "", start_time: "", end_time: "", location: "", participants: "", status: "待开始" },
    showDialog: false,
  }),
  actions: {
    async fetchMeetings() { try { const res = await api.get("/meetings"); if (res.data.success) this.meetingList = res.data.data; } catch (e) { console.error(e); } },
    async saveMeeting() { try { if (this.editForm.id) await api.put(`/meetings/${this.editForm.id}`, this.editForm); else await api.post("/meetings", this.editForm); await this.fetchMeetings(); this.editForm = { id: "", title: "", content: "", organizer: "", meeting_date: "", start_time: "", end_time: "", location: "", participants: "", status: "待开始" }; this.showDialog = false; } catch (e) { console.error(e); } },
    async deleteMeeting(id) { try { await api.delete(`/meetings/${id}`); await this.fetchMeetings(); } catch (e) { console.error(e); } },
    editMeeting(row) { this.editForm = { ...row }; this.showDialog = true; },
    addMeeting() { this.editForm = { id: "", title: "", content: "", organizer: "", meeting_date: "", start_time: "", end_time: "", location: "", participants: "", status: "待开始" }; this.showDialog = true; },
  },
});
