import { defineStore } from "pinia";
import api from "@/api";

export const useScoreStore = defineStore("score", {
  state: () => ({
    scoreList: [],
    editForm: { id: "", student_id: "", course_id: "", score: "", semester: "" },
    showDialog: false,
  }),
  actions: {
    async fetchScores() {
      try {
        const res = await api.get("/scores");
        if (res.data.success) {
          this.scoreList = res.data.data;
        }
      } catch (error) {
        console.error("获取成绩列表失败:", error);
      }
    },
    async saveScore() {
      try {
        if (this.editForm.id) {
          await api.put(`/scores/${this.editForm.id}`, this.editForm);
        } else {
          await api.post("/scores", this.editForm);
        }
        await this.fetchScores();
        this.editForm = { id: "", student_id: "", course_id: "", score: "", semester: "" };
        this.showDialog = false;
      } catch (error) {
        console.error("保存成绩失败:", error);
      }
    },
    async deleteScore(id) {
      try {
        await api.delete(`/scores/${id}`);
        await this.fetchScores();
      } catch (error) {
        console.error("删除成绩失败:", error);
      }
    },
    editScore(row) {
      this.editForm = { ...row };
      this.showDialog = true;
    },
    addScore() {
      this.editForm = { id: "", student_id: "", course_id: "", score: "", semester: "" };
      this.showDialog = true;
    },
  },
});
