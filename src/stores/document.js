import { defineStore } from "pinia";
import api from "@/api";

export const useDocumentStore = defineStore("document", {
  state: () => ({
    documentList: [],
    editForm: { id: "", title: "", content: "", type: "", status: "", author: "" },
    showDialog: false,
  }),
  actions: {
    async fetchDocuments() { try { const res = await api.get("/documents"); if (res.data.success) this.documentList = res.data.data; } catch (e) { console.error(e); } },
    async saveDocument() { try { if (this.editForm.id) await api.put(`/documents/${this.editForm.id}`, this.editForm); else await api.post("/documents", this.editForm); await this.fetchDocuments(); this.showDialog = false; } catch (e) { console.error(e); } },
    async deleteDocument(id) { try { await api.delete(`/documents/${id}`); await this.fetchDocuments(); } catch (e) { console.error(e); } },
    editDocument(row) { this.editForm = { ...row }; this.showDialog = true; },
    addDocument() { this.editForm = { id: "", title: "", content: "", type: "", status: "", author: "" }; this.showDialog = true; },
  },
});
