<template>
  <div class="page-container">
    <el-card>
      <div class="card-header">
        <h3>会议管理</h3>
        <el-button type="primary" @click="store.addMeeting()">
          <el-icon><Plus /></el-icon>添加会议
        </el-button>
      </div>
      <el-table :data="store.meetingList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="title" label="会议标题"/>
        <el-table-column prop="organizer" label="组织人" width="100"/>
        <el-table-column prop="meeting_date" label="日期" width="120"/>
        <el-table-column prop="start_time" label="时间" width="100"/>
        <el-table-column prop="location" label="地点"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope"><el-tag :type="scope.row.status==='已完成'?'success':scope.row.status==='进行中'?'warning':'info'">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="store.editMeeting(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="store.deleteMeeting(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="会议信息" v-model="store.showDialog" width="600px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="标题"><el-input v-model="store.editForm.title"/></el-form-item>
          <el-form-item label="内容"><el-input v-model="store.editForm.content" type="textarea" rows="3"/></el-form-item>
          <el-form-item label="组织人"><el-input v-model="store.editForm.organizer"/></el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="store.editForm.meeting_date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
          </el-form-item>
          <el-form-item label="时间">
            <el-input v-model="store.editForm.start_time" placeholder="如：14:00" style="width:48%"/>
            <span style="margin:0 4%">至</span>
            <el-input v-model="store.editForm.end_time" placeholder="如：16:00" style="width:48%"/>
          </el-form-item>
          <el-form-item label="地点"><el-input v-model="store.editForm.location"/></el-form-item>
          <el-form-item label="参与人"><el-input v-model="store.editForm.participants"/></el-form-item>
          <el-form-item label="状态">
            <el-select v-model="store.editForm.status" style="width:100%">
              <el-option label="待开始" value="待开始"/>
              <el-option label="进行中" value="进行中"/>
              <el-option label="已完成" value="已完成"/>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveMeeting()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useMeetingStore } from "@/stores/meeting";
import { Plus } from "@element-plus/icons-vue";
const store = useMeetingStore();
onMounted(() => { store.fetchMeetings(); });
</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
