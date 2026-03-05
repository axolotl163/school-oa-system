import { defineStore } from "pinia";
import api from "@/api";
export const useLabStore = defineStore("lab", {
  state: () => ({ labList: [], editForm: {}, showDialog: false }),
  actions: {
    async fetchLabs() { try { const r = await api.get("/labs"); if (r.data.success) this.labList = r.data.data; } catch (e) { console.error(e); } },
    async saveLab() { try { if (this.editForm.id) await api.put(`/labs/${this.editForm.id}`, this.editForm); else await api.post("/labs", this.editForm); await this.fetchLabs(); this.showDialog = false; } catch (e) { console.error(e); } },
    async deleteLab(id) { try { await api.delete(`/labs/${id}`); await this.fetchLabs(); } catch (e) { console.error(e); } },
    editLab(row) { this.editForm = { ...row }; this.showDialog = true; },
    addLab() { this.editForm = { id: "", name: "", location: "", capacity: "", equipment_count: "", status: "正常" }; this.showDialog = true; },
  },
});
