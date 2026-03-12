<template>
  <div class="user-manage">
    <el-card>
      <div class="card-header">
        <h3>用户管理</h3>
        <el-button type="primary" @click="userStore.addUser()">
          <el-icon><Plus /></el-icon>添加用户
        </el-button>
      </div>

      <el-table :data="userStore.userList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="class_id" label="关联班级" width="120">
          <template #default="scope">
            {{ getClassName(scope.row.class_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <template v-if="scope.row.role !== '管理员'">
              <el-button type="primary" size="small" @click="userStore.editUser(scope.row)">
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button 
                v-if="!isCurrentUser(scope.row)" 
                type="danger" 
                size="small" 
                @click="userStore.deleteUser(scope.row.id)"
              >
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="用户信息" v-model="userStore.showDialog" width="500px">
        <el-form :model="userStore.editForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="userStore.editForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userStore.editForm.password" type="password" :placeholder="userStore.editForm.id ? '留空则不修改' : '请输入密码'"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="userStore.editForm.role" :disabled="isEditingCurrentUser" style="width:100%" @change="handleRoleChange">
              <el-option label="教师" value="教师" />
              <el-option label="学生" value="学生" />
            </el-select>
          </el-form-item>
          <el-form-item label="关联班级" :required="userStore.editForm.role === '教师'">
            <el-select v-model="userStore.editForm.class_id" :disabled="isEditingCurrentUser" :placeholder="userStore.editForm.role === '教师' ? '请选择班级' : '选择班级（可选）'" :clearable="userStore.editForm.role !== '教师'" style="width:100%">
              <el-option v-for="c in classStore.classList" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="userStore.showDialog = false">取消</el-button>
          <el-button type="primary" @click="userStore.saveUser()">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useUserManageStore } from "@/stores/userManage";
import { useLoginStore } from "@/stores/login";
import { useClassStore } from "@/stores/class";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const userStore = useUserManageStore();
const loginStore = useLoginStore();
const classStore = useClassStore();

const currentUsername = computed(() => loginStore.userInfo.username);

const isEditingCurrentUser = computed(() => {
  return userStore.editForm.username === currentUsername.value;
});

onMounted(() => {
  userStore.fetchUsers();
  classStore.fetchClasses();
});

function getRoleType(role) {
  if (role === '管理员') return 'danger';
  if (role === '教师') return 'success';
  return 'warning';
}

function isCurrentUser(row) {
  return row.username === currentUsername.value;
}

function getClassName(classId) {
  if (!classId) return '-';
  const cls = classStore.classList.find(c => c.id === classId);
  return cls ? cls.name : '-';
}

function handleRoleChange() {
  if (userStore.editForm.role === '学生') {
    userStore.editForm.class_id = null;
  }
}
</script>

<style scoped>
.user-manage { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
