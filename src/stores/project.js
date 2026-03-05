import { defineStore } from "pinia";
import api from "@/api";
export const useProjectStore = defineStore("project", {
  state: () => ({ projectList: [], editForm: {}, showDialog: false }),
  actions: {
    async fetchProjects() { try { const r = await api.get("/projects"); if (r.data.success) this.projectList = r.data.data; } catch (e) { console.error(e); } },
    async saveProject() { try { if (this.editForm.id) await api.put(`/projects/${this.editForm.id}`, this.editForm); else await api.post("/projects", this.editForm); await this.fetchProjects(); this.showDialog = false; } catch (e) { console.error(e); } },
    async deleteProject(id) { try { await api.delete(`/projects/${id}`); await this.fetchProjects(); } catch (e) { console.error(e); } },
    editProject(row) { this.editForm = { ...row }; this.showDialog = true; },
    addProject() { this.editForm = { id: "", name: "", description: "", leader: "", budget: "", start_date: "", end_date: "", status: "待审批" }; this.showDialog = true; },
  },
});
