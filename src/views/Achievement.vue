<template>
  <div class="page-container">
    <el-card>
      <div class="card-header"><h3>科研成果管理</h3><el-button type="primary" @click="store.addAchievement()">添加成果</el-button></div>
      <el-table :data="store.achievementList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="name" label="成果名称"/>
        <el-table-column prop="project_name" label="所属项目" width="150"/>
        <el-table-column prop="type" label="类型" width="100"/>
        <el-table-column prop="publish_date" label="发布日期" width="120"/>
        <el-table-column label="操作" width="100"><template #default="scope"><el-button type="danger" size="small" @click="store.deleteAchievement(scope.row.id)">删除</el-button></template></el-table-column>
      </el-table>
      <el-dialog title="成果信息" v-model="store.showDialog" width="500px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="项目"><el-select v-model="store.editForm.project_id"><el-option v-for="p in projectStore.projectList" :key="p.id" :label="p.name" :value="p.id"/></el-select></el-form-item>
          <el-form-item label="名称"><el-input v-model="store.editForm.name"/></el-form-item>
          <el-form-item label="类型"><el-input v-model="store.editForm.type"/></el-form-item>
          <el-form-item label="描述"><el-input v-model="store.editForm.description" type="textarea"/></el-form-item>
          <el-form-item label="发布日期"><el-date-picker v-model="store.editForm.publish_date" type="date" value-format="YYYY-MM-DD"/></el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveAchievement()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useAchievementStore } from "@/stores/achievement";
import { useProjectStore } from "@/stores/project";
const store = useAchievementStore();
const projectStore = useProjectStore();
onMounted(() => { store.fetchAchievements(); projectStore.fetchProjects(); });
</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
