<template>
  <div class="page-container">
    <el-card>
      <div class="card-header"><h3>实验室管理</h3><el-button type="primary" @click="store.addLab()">添加实验室</el-button></div>
      <el-table :data="store.labList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="name" label="实验室名称"/>
        <el-table-column prop="location" label="位置"/>
        <el-table-column prop="capacity" label="容量" width="80"/>
        <el-table-column prop="equipment_count" label="设备数" width="80"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope"><el-tag :type="scope.row.status==='正常'?'success':'danger'">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope"><el-button type="primary" size="small" @click="store.editLab(scope.row)">编辑</el-button><el-button type="danger" size="small" @click="store.deleteLab(scope.row.id)">删除</el-button></template>
        </el-table-column>
      </el-table>
      <el-dialog title="实验室信息" v-model="store.showDialog" width="500px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="名称"><el-input v-model="store.editForm.name"/></el-form-item>
          <el-form-item label="位置"><el-input v-model="store.editForm.location"/></el-form-item>
          <el-form-item label="容量"><el-input v-model.number="store.editForm.capacity" type="number"/></el-form-item>
          <el-form-item label="设备数"><el-input v-model.number="store.editForm.equipment_count" type="number"/></el-form-item>
          <el-form-item label="状态"><el-select v-model="store.editForm.status"><el-option label="正常" value="正常"/><el-option label="维护中" value="维护中"/><el-option label="停用" value="停用"/></el-select></el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveLab()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useLabStore } from "@/stores/lab";
const store = useLabStore();
onMounted(() => { store.fetchLabs(); });
</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
