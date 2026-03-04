<template>
  <div class="course">
    <el-card>
      <div class="card-header">
        <h3>课程管理</h3>
        <el-button type="primary" @click="courseStore.addCourse()">
          <el-icon><Plus /></el-icon>添加课程
        </el-button>
      </div>

      <el-table :data="courseStore.courseList" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="课程名称" width="150" />
        <el-table-column prop="code" label="课程代码" width="100" />
        <el-table-column prop="credits" label="学分" width="60" />
        <el-table-column prop="hours" label="课时" width="60" />
        <el-table-column prop="teacher_name" label="授课教师" width="100" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="courseStore.editCourse(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" size="small" @click="courseStore.deleteCourse(scope.row.id)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="课程信息" v-model="courseStore.showDialog" width="500px">
        <el-form :model="courseStore.editForm" label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="courseStore.editForm.name" placeholder="请输入课程名称"></el-input>
          </el-form-item>
          <el-form-item label="课程代码">
            <el-input v-model="courseStore.editForm.code" placeholder="如：CS101"></el-input>
          </el-form-item>
          <el-form-item label="学分">
            <el-input v-model.number="courseStore.editForm.credits" placeholder="请输入学分"></el-input>
          </el-form-item>
          <el-form-item label="课时">
            <el-input v-model.number="courseStore.editForm.hours" placeholder="请输入课时"></el-input>
          </el-form-item>
          <el-form-item label="授课教师">
            <el-select v-model="courseStore.editForm.teacher_id" placeholder="请选择教师">
              <el-option v-for="t in teacherStore.teacherList" :key="t.id" :label="t.name" :value="t.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="courseStore.showDialog = false">取消</el-button>
          <el-button type="primary" @click="courseStore.saveCourse()">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCourseStore } from "@/stores/course";
import { useTeacherStore } from "@/stores/teacher";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";

const courseStore = useCourseStore();
const teacherStore = useTeacherStore();

onMounted(() => {
  courseStore.fetchCourses();
  teacherStore.fetchTeachers();
});
</script>

<style scoped>
.course { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
