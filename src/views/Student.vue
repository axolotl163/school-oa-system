<template>
  <div class="student">
    <el-card>
      <div class="card-header">
        <h3>学生信息管理</h3>
        <el-button type="primary" @click="studentStore.addStudent()">
          <el-icon><Plus /></el-icon>新增学生
        </el-button>
      </div>

      <!-- 学生列表 -->
      <el-table
        :data="studentStore.studentList"
        border
        stripe
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="class" label="班级" width="120" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="studentStore.editStudent(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" size="small" @click="studentStore.deleteStudent(scope.row.id)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑弹窗 -->
      <el-dialog title="学生信息" v-model="studentStore.showDialog" width="500px">
        <el-form :model="studentStore.editForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="studentStore.editForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input
              v-model.number="studentStore.editForm.age"
              placeholder="请输入年龄"
            ></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="studentStore.editForm.class" placeholder="请输入班级"></el-input>
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
import { onMounted } from "vue";
import { useStudentStore } from "@/stores/student";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const studentStore = useStudentStore();

onMounted(() => {
  studentStore.fetchStudents();
});
</script>

<style scoped>
.student {
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
