<template>
  <div class="task">
    <el-card>
      <div class="card-header">
        <h3>任务管理</h3>
        <el-button type="primary" @click="taskStore.addTask()">
          <el-icon><Plus /></el-icon>创建任务
        </el-button>
      </div>

      <el-table :data="taskStore.taskList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="任务标题" width="150" />
        <el-table-column prop="content" label="任务内容" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="scope">
            <el-tag :type="getPriorityType(scope.row.priority)">{{ scope.row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assignee" label="负责人" width="100" />
        <el-table-column prop="due_date" label="截止日期" width="120" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="taskStore.editTask(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" size="small" @click="taskStore.deleteTask(scope.row.id)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="任务信息" v-model="taskStore.showDialog" width="600px">
        <el-form :model="taskStore.editForm" label-width="80px">
          <el-form-item label="任务标题">
            <el-input v-model="taskStore.editForm.title" placeholder="请输入任务标题"></el-input>
          </el-form-item>
          <el-form-item label="任务内容">
            <el-input v-model="taskStore.editForm.content" type="textarea" rows="3" placeholder="请输入任务内容"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="taskStore.editForm.status">
              <el-option label="待处理" value="待处理" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
            </el-select>
          </el-form-item>
          <el-form-item label="优先级">
            <el-select v-model="taskStore.editForm.priority">
              <el-option label="低" value="低" />
              <el-option label="普通" value="普通" />
              <el-option label="高" value="高" />
              <el-option label="紧急" value="紧急" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="taskStore.editForm.assignee" placeholder="请输入负责人"></el-input>
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker v-model="taskStore.editForm.due_date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="taskStore.showDialog = false">取消</el-button>
          <el-button type="primary" @click="taskStore.saveTask()">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useTaskStore } from "@/stores/task";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.fetchTasks();
});

function getStatusType(status) {
  if (status === '已完成') return 'success';
  if (status === '进行中') return 'warning';
  return 'info';
}

function getPriorityType(priority) {
  if (priority === '高' || priority === '紧急') return 'danger';
  if (priority === '普通') return 'warning';
  return 'info';
}
</script>

<style scoped>
.task { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
