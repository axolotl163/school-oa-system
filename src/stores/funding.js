import { defineStore } from "pinia";
import api from "@/api";

export const useFundingStore = defineStore("funding", {
  state: () => ({
    projects: [],
    applications: [],
    approvals: [],
    notices: [],
    objections: [],
    distributions: [],
    editProjectForm: { id: "", name: "", type: "奖学金", amount: "", quota: "", application_start_date: "", application_end_date: "", requirements: "", status: "开放" },
    editApplicationForm: { id: "", project_id: "", apply_reason: "", materials: "" },
    editApprovalForm: { application_id: "", status: "", comment: "" },
    editNoticeForm: { id: "", project_id: "", content: "", start_date: "", end_date: "" },
    editObjectionForm: { notice_id: "", content: "" },
    editDistributionForm: { application_id: "", amount: "" },
    showProjectDialog: false,
    showApplicationDialog: false,
    showApprovalDialog: false,
    showNoticeDialog: false,
    showObjectionDialog: false,
    showDistributionDialog: false,
  }),
  actions: {
    async fetchProjects() {
      try {
        const res = await api.get("/funding/projects");
        if (res.data.success) this.projects = res.data.data;
      } catch (error) { console.error("获取资助项目失败:", error); }
    },
    async fetchApplications() {
      try {
        const res = await api.get("/funding/applications");
        if (res.data.success) this.applications = res.data.data;
      } catch (error) { console.error("获取申请列表失败:", error); }
    },
    async fetchApprovals(applicationId) {
      try {
        const res = await api.get(`/funding/approvals/application/${applicationId}`);
        if (res.data.success) this.approvals = res.data.data;
      } catch (error) { console.error("获取审核记录失败:", error); }
    },
    async fetchNotices() {
      try {
        const res = await api.get("/funding/notices");
        if (res.data.success) this.notices = res.data.data;
      } catch (error) { console.error("获取公示列表失败:", error); }
    },
    async fetchObjections() {
      try {
        const res = await api.get("/funding/objections");
        if (res.data.success) this.objections = res.data.data;
      } catch (error) { console.error("获取异议列表失败:", error); }
    },
    async fetchDistributions() {
      try {
        const res = await api.get("/funding/distributions");
        if (res.data.success) this.distributions = res.data.data;
      } catch (error) { console.error("获取发放记录失败:", error); }
    },
    async saveProject() {
      try {
        const data = { ...this.editProjectForm };
        data.amount = Number(data.amount) || 0;
        data.quota = Number(data.quota) || 0;
        console.log('保存项目数据:', data);
        
        if (this.editProjectForm.id) {
          await api.put(`/funding/projects/${this.editProjectForm.id}`, data);
        } else {
          await api.post("/funding/projects", data);
        }
        await this.fetchProjects();
        this.editProjectForm = { id: "", name: "", type: "奖学金", amount: "", quota: "", application_start_date: "", application_end_date: "", requirements: "", status: "开放" };
        this.showProjectDialog = false;
      } catch (error) { console.error("保存项目失败:", error); }
    },
    async deleteProject(id) {
      try { await api.delete(`/funding/projects/${id}`); await this.fetchProjects(); }
      catch (error) { console.error("删除项目失败:", error); }
    },
    editProject(row) { this.editProjectForm = { ...row }; this.showProjectDialog = true; },
    addProject() { this.editProjectForm = { id: "", name: "", type: "奖学金", amount: "", quota: "", application_start_date: "", application_end_date: "", requirements: "", status: "开放" }; this.showProjectDialog = true; },
    async saveApplication() {
      try {
        if (this.editApplicationForm.id) {
          await api.put(`/funding/applications/${this.editApplicationForm.id}`, this.editApplicationForm);
        } else {
          await api.post("/funding/applications", this.editApplicationForm);
        }
        await this.fetchApplications();
        this.editApplicationForm = { id: "", project_id: "", apply_reason: "", materials: "" };
        this.showApplicationDialog = false;
      } catch (error) { console.error("保存申请失败:", error); }
    },
    async deleteApplication(id) {
      try { await api.delete(`/funding/applications/${id}`); await this.fetchApplications(); }
      catch (error) { console.error("撤回申请失败:", error); }
    },
    editApplication(row) { this.editApplicationForm = { ...row }; this.showApplicationDialog = true; },
    addApplication() { this.editApplicationForm = { id: "", project_id: "", apply_reason: "", materials: "" }; this.showApplicationDialog = true; },
    async saveApproval() {
      try {
        await api.post("/funding/approvals", this.editApprovalForm);
        await this.fetchApplications();
        this.editApprovalForm = { application_id: "", status: "", comment: "" };
        this.showApprovalDialog = false;
      } catch (error) { console.error("审核失败:", error); }
    },
    async saveNotice() {
      try {
        if (this.editNoticeForm.id) {
          await api.put(`/funding/notices/${this.editNoticeForm.id}`, this.editNoticeForm);
        } else {
          await api.post("/funding/notices", this.editNoticeForm);
        }
        await this.fetchNotices();
        this.editNoticeForm = { id: "", project_id: "", content: "", start_date: "", end_date: "" };
        this.showNoticeDialog = false;
      } catch (error) { console.error("保存公示失败:", error); }
    },
    async saveObjection() {
      try {
        await api.post(`/funding/notices/${this.editObjectionForm.notice_id}/objections`, { content: this.editObjectionForm.content });
        await this.fetchObjections();
        this.editObjectionForm = { notice_id: "", content: "" };
        this.showObjectionDialog = false;
      } catch (error) { console.error("提交异议失败:", error); }
    },
    async handleObjection(id, status, reply) {
      try {
        await api.put(`/funding/objections/${id}`, { status, reply });
        await this.fetchObjections();
      } catch (error) { console.error("处理异议失败:", error); }
    },
    async saveDistribution() {
      try {
        if (this.editDistributionForm.id) {
          await api.put(`/funding/distributions/${this.editDistributionForm.id}`, this.editDistributionForm);
        } else {
          await api.post("/funding/distributions", this.editDistributionForm);
        }
        await this.fetchDistributions();
        this.editDistributionForm = { application_id: "", amount: "" };
        this.showDistributionDialog = false;
      } catch (error) { console.error("保存发放记录失败:", error); }
    },
    async updateDistributionStatus(id, status, distribution_date, failure_reason) {
      try {
        await api.put(`/funding/distributions/${id}`, { status, distribution_date, failure_reason });
        await this.fetchDistributions();
      } catch (error) { console.error("更新发放状态失败:", error); }
    },
    async confirmDistribution(id) {
      try {
        await api.post(`/funding/distributions/${id}/confirm`);
        await this.fetchDistributions();
      } catch (error) { console.error("确认到账失败:", error); }
    },
  },
});