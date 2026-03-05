<template>
  <div class="page-container">
    <el-card>
      <div class="card-header"><h3>科研项目管理</h3><el-button type="primary" @click="store.addProject()">添加项目</el-button></div>
      <el-table :data="store.projectList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="name" label="项目名称"/>
        <el-table-column prop="leader" label="负责人" width="100"/>
        <el-table-column prop="budget" label="经费" width="100"/>
        <el-table-column prop="start_date" label="开始日期" width="120"/>
        <el-table-column prop="end_date" label="结束日期" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope"><el-tag :type="scope.row.status==='进行中'?'success':scope.row.status==='待审批'?'warning':'info'">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope"><el-button type="primary" size="small" @click="store.editProject(scope.row)">编辑</el-button><el-button type="danger" size="small" @click="store.deleteProject(scope.row.id)">删除</el-button></template>
        </el-table-column>
      </el-table>
      <el-dialog title="项目信息" v-model="store.showDialog" width="600px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="名称"><el-input v-model="store.editForm.name"/></el-form-item>
          <el-form-item label="描述"><el-input v-model="store.editForm.description" type="textarea"/></el-form-item>
          <el-form-item label="负责人"><el-input v-model="store.editForm.leader"/></el-form-item>
          <el-form-item label="经费"><el-input v-model.number="store.editForm.budget" type="number"/></el-form-item>
          <el-form-item label="开始日期"><el-date-picker v-model="store.editForm.start_date" type="date" value-format="YYYY-MM-DD"/></el-form-item>
          <el-form-item label="结束日期"><el-date-picker v-model="store.editForm.end_date" type="date" value-format="YYYY-MM-DD"/></el-form-item>
          <el-form-item label="状态"><el-select v-model="store.editForm.status"><el-option label="待审批" value="待审批"/><el-option label="进行中" value="进行中"/><el-option label="已结题" value="已结题"/></el-select></el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveProject()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>import{onMounted}from"vue";import{useProjectStore}from"@/stores/project";const store=useProjectStore();onMounted(()=>{store.fetchProjects();});</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
