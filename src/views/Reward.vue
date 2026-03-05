<template>
  <div class="page-container">
    <el-card>
      <div class="card-header">
        <h3>奖惩管理</h3>
        <el-button type="primary" @click="store.addReward()" v-if="canEdit">
          <el-icon><Plus /></el-icon>添加奖惩
        </el-button>
      </div>
      <el-table :data="store.rewardList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="student_name" label="学生" width="100"/>
        <el-table-column prop="type" label="类型" width="80">
          <template #default="scope"><el-tag :type="scope.row.type==='奖励'?'success':'danger'">{{ scope.row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reason" label="原因"/>
        <el-table-column prop="amount" label="金额" width="80"/>
        <el-table-column prop="date" label="日期" width="120"/>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope"><el-tag :type="scope.row.status==='已通过'?'success':scope.row.status==='待审批'?'warning':'info'">{{ scope.row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="store.editReward(scope.row)" v-if="canEdit">编辑</el-button>
            <el-button type="danger" size="small" @click="store.deleteReward(scope.row.id)" v-if="canEdit">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="奖惩信息" v-model="store.showDialog" width="500px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="学生">
            <el-select v-model="store.editForm.student_id" placeholder="选择学生" style="width:100%">
              <el-option v-for="s in filteredStudents" :key="s.id" :label="s.name" :value="s.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="store.editForm.type" style="width:100%">
              <el-option label="奖励" value="奖励"/>
              <el-option label="处分" value="处分"/>
            </el-select>
          </el-form-item>
          <el-form-item label="原因"><el-input v-model="store.editForm.reason"/></el-form-item>
          <el-form-item label="金额"><el-input v-model.number="store.editForm.amount" type="number"/></el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="store.editForm.date" type="date" value-format="YYYY-MM-DD" style="width:100%"/>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="store.editForm.status" style="width:100%">
              <el-option label="待审批" value="待审批"/>
              <el-option label="已通过" value="已通过"/>
              <el-option label="已拒绝" value="已拒绝"/>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog=false">取消</el-button><el-button type="primary" @click="store.saveReward()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useRewardStore } from "@/stores/reward";
import { useStudentStore } from "@/stores/student";
import { useLoginStore } from "@/stores/login";
import { Plus } from "@element-plus/icons-vue";
const store = useRewardStore();
const studentStore = useStudentStore();
const loginStore = useLoginStore();

const canEdit = computed(() => {
  return loginStore.userInfo.role !== "学生";
});

const filteredStudents = computed(() => {
  const role = loginStore.userInfo.role;
  const classId = loginStore.userInfo.class_id;
  if (role === "管理员" || !classId) {
    return studentStore.studentList;
  }
  return studentStore.studentList.filter(s => s.class_id === classId);
});

onMounted(() => { store.fetchRewards(); studentStore.fetchStudents(); });
</script>
<style scoped>.page-container{height:100%}.card-header{display:flex;justify-content:space-between;align-items:center}</style>
