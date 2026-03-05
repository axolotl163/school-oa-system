<template>
  <div class="page-container">
    <el-card>
      <div class="card-header">
        <h3>公文管理</h3>
        <el-button type="primary" @click="store.addDocument()">
          <el-icon><Plus /></el-icon>添加公文
        </el-button>
      </div>
      <el-table :data="store.documentList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="type" label="类型" width="100"/>
        <el-table-column prop="author" label="作者" width="100"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope"><el-tag :type="scope.row.status==='已发布'?'success':'warning'">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="store.editDocument(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="store.deleteDocument(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="公文信息" v-model="store.showDialog" width="600px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="标题"><el-input v-model="store.editForm.title"/></el-form-item>
          <el-form-item label="内容"><el-input v-model="store.editForm.content" type="textarea" rows="4"/></el-form-item>
          <el-form-item label="类型">
            <el-select v-model="store.editForm.type" style="width:100%">
              <el-option label="通知" value="通知"/>
              <el-option label="决定" value="决定"/>
              <el-option label="报告" value="报告"/>
              <el-option label="请示" value="请示"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="store.editForm.status" style="width:100%">
              <el-option label="待审批" value="待审批"/>
              <el-option label="已发布" value="已发布"/>
            </el-select>
          </el-form-item>
          <el-form-item label="作者"><el-input v-model="store.editForm.author"/></el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveDocument()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useDocumentStore } from "@/stores/document";
import { Plus } from "@element-plus/icons-vue";
const store = useDocumentStore();
onMounted(() => { store.fetchDocuments(); });
</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
