import { defineStore } from "pinia";
import api from "@/api";

export const useRewardStore = defineStore("reward", {
  state: () => ({
    rewardList: [],
    editForm: { id: "", student_id: "", type: "", reason: "", amount: "", date: "", status: "待审批" },
    showDialog: false,
  }),
  actions: {
    async fetchRewards() {
      try {
        const res = await api.get("/rewards");
        if (res.data.success) this.rewardList = res.data.data;
      } catch (error) { console.error("获取奖惩列表失败:", error); }
    },
    async saveReward() {
      try {
        if (this.editForm.id) {
          await api.put(`/rewards/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/rewards", this.editForm);
        }
        await this.fetchRewards();
        this.editForm = { id: "", student_id: "", type: "", reason: "", amount: "", date: "", status: "待审批" };
        this.showDialog = false;
      } catch (error) { console.error("保存奖惩失败:", error); }
    },
    async deleteReward(id) {
      try { await api.delete(`/rewards/${id}`); await this.fetchRewards(); }
      catch (error) { console.error("删除奖惩失败:", error); }
    },
    editReward(row) { this.editForm = { ...row }; this.showDialog = true; },
    addReward() { this.editForm = { id: "", student_id: "", type: "", reason: "", amount: "", date: "", status: "待审批" }; this.showDialog = true; },
  },
});
