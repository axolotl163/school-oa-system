import { defineStore } from "pinia";
import api from "@/api";
export const useAchievementStore = defineStore("achievement", {
  state: () => ({ achievementList: [], editForm: {}, showDialog: false }),
  actions: {
    async fetchAchievements() { try { const r = await api.get("/achievements"); if (r.data.success) this.achievementList = r.data.data; } catch (e) { console.error(e); } },
    async saveAchievement() { try { await api.post("/achievements", this.editForm); await this.fetchAchievements(); this.showDialog = false; } catch (e) { console.error(e); } },
    async deleteAchievement(id) { try { await api.delete(`/achievements/${id}`); await this.fetchAchievements(); } catch (e) { console.error(e); } },
    addAchievement() { this.editForm = { id: "", project_id: "", name: "", type: "", description: "", publish_date: "" }; this.showDialog = true; },
  },
});
