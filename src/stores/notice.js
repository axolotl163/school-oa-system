import { defineStore } from "pinia";
import api from "@/api";

export const useNoticeStore = defineStore("notice", {
  state: () => ({
    noticeList: [],
    noticeForm: { title: "", content: "" },
    showNoticeDialog: false,
  }),
  actions: {
    async fetchNotices() {
      try {
        const res = await api.get("/notices");
        if (res.data.success) {
          this.noticeList = res.data.data;
        }
      } catch (error) {
        console.error("获取公告列表失败:", error);
      }
    },
    async publishNotice() {
      try {
        await api.post("/notices", this.noticeForm);
        await this.fetchNotices();
        this.noticeForm = { title: "", content: "" };
        this.showNoticeDialog = false;
      } catch (error) {
        console.error("发布公告失败:", error);
      }
    },
    async deleteNotice(id) {
      try {
        await api.delete(`/notices/${id}`);
        await this.fetchNotices();
      } catch (error) {
        console.error("删除公告失败:", error);
      }
    },
  },
});
