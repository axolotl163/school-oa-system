import { defineStore } from "pinia";
import api from "@/api";

export const useEvaluationStore = defineStore("evaluation", {
  state: () => ({ evaluationList: [] }),
  actions: {
    async fetchEvaluations() {
      try { const res = await api.get("/evaluations"); if (res.data.success) this.evaluationList = res.data.data; }
      catch (error) { console.error("获取评价列表失败:", error); }
    },
    async addEvaluation(data) { await api.post("/evaluations", data); await this.fetchEvaluations(); },
    async deleteEvaluation(id) { await api.delete(`/evaluations/${id}`); await this.fetchEvaluations(); },
  },
});
