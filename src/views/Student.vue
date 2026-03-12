<template>
  <div class="student">
    <el-card>
      <div class="card-header">
        <h3>学生信息管理</h3>
        <div v-if="canEdit">管理员权限</div>
        <div v-else>非管理员权限</div>
        <div>用户角色: {{ loginStore.userInfo.role }}</div>
        <el-button type="primary" @click="studentStore.addStudent()" v-if="canEdit">
          <el-icon><Plus /></el-icon>新增学生
        </el-button>
      </div>

      <el-table :data="studentStore.studentList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="class_name" label="班级" width="150" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="studentStore.editStudent(scope.row)" v-if="canEdit">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" size="small" @click="studentStore.deleteStudent(scope.row.id)" v-if="canEdit">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="学生信息" v-model="studentStore.showDialog" width="500px">
        <el-form :model="studentStore.editForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="studentStore.editForm.name" placeholder="请输入姓名（同时作为登录用户名）"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="studentStore.editForm.password" type="password" placeholder="登录密码（可选）"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model.number="studentStore.editForm.age" placeholder="请输入年龄"></el-input>
          </el-form-item>
          <el-form-item label="班级" required>
            <el-select v-model="studentStore.editForm.class_id" placeholder="请选择班级" style="width:100%">
              <el-option v-for="c in filteredClasses" :key="c.id" :label="c.name" :value="c.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="studentStore.editForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="studentStore.showDialog = false">取消</el-button>
          <el-button type="primary" @click="studentStore.saveStudent()">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStudentStore } from "@/stores/student";
import { useClassStore } from "@/stores/class";
import { useLoginStore } from "@/stores/login";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const studentStore = useStudentStore();
const classStore = useClassStore();
const loginStore = useLoginStore();

const canEdit = computed(() => {
  return loginStore.userInfo.role === "管理员";
});

const filteredClasses = computed(() => {
  const role = loginStore.userInfo.role;
  const classId = loginStore.userInfo.class_id;
  if (role === "管理员" || !classId) {
    return classStore.classList;
  }
  return classStore.classList.filter(c => c.id === classId);
});

onMounted(() => {
  studentStore.fetchStudents();
  classStore.fetchClasses();
});
</script>

<style scoped>
.student { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
