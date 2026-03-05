<template>
  <div class="teacher">
    <el-card>
      <div class="card-header">
        <h3>教师信息管理</h3>
        <el-button type="primary" @click="teacherStore.addTeacher()">
          <el-icon><Plus /></el-icon>添加教师
        </el-button>
      </div>

      <el-table :data="teacherStore.teacherList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="title" label="职称" width="100" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="class_name" label="所属班级" width="120" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="teacherStore.editTeacher(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" size="small" @click="teacherStore.deleteTeacher(scope.row.id)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="教师信息" v-model="teacherStore.showDialog" width="500px">
        <el-form :model="teacherStore.editForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="teacherStore.editForm.name" placeholder="请输入姓名（同时作为登录用户名）"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="teacherStore.editForm.password" type="password" placeholder="登录密码"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="teacherStore.editForm.gender" placeholder="请选择性别">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="职称">
            <el-input v-model="teacherStore.editForm.title" placeholder="如：教授、副教授"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="teacherStore.editForm.department" placeholder="如：计算机系"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="teacherStore.editForm.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="所属班级" required>
            <el-select v-model="teacherStore.editForm.class_id" placeholder="请选择班级" style="width:100%">
              <el-option v-for="c in classStore.classList" :key="c.id" :label="c.name" :value="c.id"/>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="teacherStore.showDialog = false">取消</el-button>
          <el-button type="primary" @click="teacherStore.saveTeacher()">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useTeacherStore } from "@/stores/teacher";
import { useClassStore } from "@/stores/class";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const teacherStore = useTeacherStore();
const classStore = useClassStore();

onMounted(() => {
  teacherStore.fetchTeachers();
  classStore.fetchClasses();
});
</script>

<style scoped>
.teacher { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
