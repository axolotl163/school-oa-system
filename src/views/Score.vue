<template>
  <div class="page-container">
    <el-card>
      <div class="card-header">
        <h3>成绩管理</h3>
        <el-button v-if="canEdit" type="primary" @click="store.addScore()">
          <el-icon><Plus /></el-icon>录入成绩
        </el-button>
      </div>
      <el-table :data="store.scoreList" border stripe style="width:100%;margin-top:20px">
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="student_name" label="学生" width="100"/>
        <el-table-column prop="course_name" label="课程" width="150"/>
        <el-table-column prop="score" label="分数" width="80">
          <template #default="scope">
            <el-tag :type="getScoreType(scope.row.score)">{{ scope.row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期" width="120"/>
        <el-table-column v-if="canEdit" label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="store.editScore(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="store.deleteScore(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="成绩信息" v-model="store.showDialog" width="500px">
        <el-form :model="store.editForm" label-width="80px">
          <el-form-item label="学生">
            <el-select v-model="store.editForm.student_id" placeholder="请选择学生" style="width:100%">
              <el-option v-for="s in filteredStudents" :key="s.id" :label="s.name" :value="s.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程">
            <el-select v-model="store.editForm.course_id" placeholder="请选择课程" style="width:100%">
              <el-option v-for="c in courseStore.courseList" :key="c.id" :label="c.name" :value="c.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="分数">
            <el-input v-model.number="store.editForm.score" placeholder="请输入分数"></el-input>
          </el-form-item>
          <el-form-item label="学期">
            <el-input v-model="store.editForm.semester" placeholder="如：2026春季"></el-input>
          </el-form-item>
        </el-form>
        <template #footer><el-button @click="store.showDialog = false">取消</el-button><el-button type="primary" @click="store.saveScore()">保存</el-button></template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useScoreStore } from "@/stores/score";
import { useStudentStore } from "@/stores/student";
import { useCourseStore } from "@/stores/course";
import { useLoginStore } from "@/stores/login";
import { Plus } from "@element-plus/icons-vue";

const store = useScoreStore();
const studentStore = useStudentStore();
const courseStore = useCourseStore();
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

function getScoreType(score) {
  if (score >= 90) return 'success';
  if (score >= 60) return 'warning';
  return 'danger';
}

onMounted(() => {
  store.fetchScores();
  studentStore.fetchStudents();
  courseStore.fetchCourses();
});
</script>

<style scoped>
.page-container { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
